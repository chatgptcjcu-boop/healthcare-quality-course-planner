// 所有結尾為 _ 的函式不可由 google.script.run 遠端呼叫。
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SHEET_ID')) {
    const ss = SpreadsheetApp.create('大四品質管理企劃案｜學生作業');
    ss.getSheets()[0].setName('企劃提交');
    props.setProperty('SHEET_ID', ss.getId());
  }
  if (!props.getProperty('CLASS_CODE')) props.setProperty('CLASS_CODE', Utilities.getUuid());
  console.log('教師試算表：https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID'));
  console.log('課程代碼（只提供給授課學生）：' + props.getProperty('CLASS_CODE'));
}
function doGet() { return HtmlService.createHtmlOutputFromFile('Index').setTitle('品質管理企劃教室').addMetaTag('viewport', 'width=device-width, initial-scale=1'); }
function doPost(e) {
  try {
    const r = submitProposal(JSON.parse(e.parameter.payload || '{}'));
    return HtmlService.createHtmlOutput('<h1>儲存成功</h1><p>回執：'+escape_(r.receipt)+'</p><p>時間：'+escape_(r.savedAt)+'</p><p>企劃已存入教師試算表，可返回原頁。請保留回執。</p>');
  } catch(err) {return HtmlService.createHtmlOutput('<h1>未確認儲存成功</h1><p>'+escape_(err.message)+'</p><p>請返回原頁保留草稿，確認代碼後重試。</p>');}
}
function escape_(s) {return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safeCell_(v) { const s=String(v == null ? '' : v); return /^[\s]*[=+@-]/.test(s) || /^\d+$/.test(s) ? "'"+s : s; }
function validate_(d) {
  if (!d || d.schemaVersion!==1 || !Array.isArray(d.members) || d.members.length!==1) throw Error('每份企劃需填一位同學');
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(d.submissionId || '')) throw Error('提交識別碼不正確');
  if (!['醫院品質管理企劃課','長照機構品質管理企劃課'].includes(d.track)) throw Error('主題不正確');
  if (!['規劃中，尚未試辦','已完成教學試辦'].includes(d.phase)) throw Error('成果狀態不正確');
  const m=d.members[0];
  for (const k of ['name','studentId','grade']) if (typeof m[k]!=='string'||!m[k].trim()||m[k].length>60) throw Error('姓名、學號及年級必填');
  if (!['一年級','二年級','三年級','四年級','其他年級'].includes(m.grade)) throw Error('年級不正確');
  for(const k of fields_()) if(typeof d[k]!=='string' || d[k].length>(['need','intro','purpose'].includes(k)?1000:6000)) throw Error('欄位格式或長度不符：'+k);
  for(const k of ['project','team','need','purpose','hours','basis','competencies','map','objectives','content','assessment','completion','improvement']) if(!d[k].trim()) throw Error('必填欄位尚未完成：'+k);
  if (!(Number(d.hours)>=0.5 && Number(d.hours)<=1000)) throw Error('課程時數必須介於0.5與1000');
}
function fields_(){return ['project','team','courseEn','unit','period','need','intro','purpose','hours','level','audience','prerequisite','basis','competencies','map','objectives','content','methods','resources','faculty','assessment','staff','pilot','evidence','completion','addie','stakeholders','improvement','references'];}
function headers_(){return ['回執','儲存時間','姓名','學號','年級','主題','成果狀態','企劃名稱','班級','英文課名','規劃協力單位','辦訓期間','訓練需求','課程簡介','課程目的','時數','職能級別','對象資格','先備條件','職能依據','表1職能','表2地圖','表3目標','表4內容','表5方法','表6資源','表7師資','表8評量','表9實際人員','表10試辦','表11證據','表12結訓','ADDIE佐證','參與紀錄','PDCA改善','參考文獻AI揭露'];}
function submitProposal(d) {
  const props = PropertiesService.getScriptProperties();
  const code = props.getProperty('CLASS_CODE');
  if (!code || typeof d.classCode!=='string' || d.classCode!==code) throw Error('課程代碼不正確，請向教师確認');
  validate_(d);
  const sheetId=props.getProperty('SHEET_ID');
  if(!sheetId) throw Error('教師尚未完成 setup');
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try {
    const sheet=SpreadsheetApp.openById(sheetId).getSheetByName('企劃提交');
    if(!sheet)throw Error('教師收件工作表不存在');
    if(sheet.getLastRow()===0){sheet.appendRow(headers_());sheet.setFrozenRows(1);}
    if(sheet.getLastRow()>1){const ids=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();const i=ids.findIndex(r=>r[0]===d.submissionId);if(i>=0){const r=sheet.getRange(i+2,1,1,2).getValues()[0];return {receipt:String(r[0]),savedAt:String(r[1])};}}
    const date=Utilities.formatDate(new Date(),'Asia/Taipei','yyyy-MM-dd HH:mm:ss');
    const m=d.members[0];
    const row=[d.submissionId,date,m.name,m.studentId,m.grade,d.track,d.phase,...fields_().map(k=>d[k])].map(safeCell_);
    sheet.appendRow(row);SpreadsheetApp.flush();
    return {receipt:d.submissionId,savedAt:date};
  }finally{lock.releaseLock();}
}
