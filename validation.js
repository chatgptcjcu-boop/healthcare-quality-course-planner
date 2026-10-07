function emptyValue(f){return f.type==='multi'?[]:f.type==='select'?f.options[0]:'';}
function initialSection(sec){return sec.repeat?(sec.initial?JSON.parse(JSON.stringify(sec.initial)):[Object.fromEntries(sec.fields.map(f=>[f.key,emptyValue(f)]))]):Object.fromEntries(sec.fields.map(f=>[f.key,emptyValue(f)]));}
function sectionErrors(sec,content){
 const errors=[],rows=sec.repeat?content:[content];
 if(!Array.isArray(rows)||!rows.length)return ['至少填寫一列'];
 rows.forEach((row,i)=>{const prefix=sec.repeat?'第'+(i+1)+'列：':'';
 sec.fields.forEach(f=>{const value=row[f.key],missing=f.type==='multi'?!Array.isArray(value)||!value.length:typeof value!=='string'||!value.trim();
 if(!f.optional&&missing)errors.push(prefix+f.label+'必填');
 if(!missing&&f.type==='number'&&(!Number.isFinite(Number(value))||Number(value)<=0))errors.push(prefix+f.label+'需大於0');
 if(!missing&&f.type==='integer'&&(!Number.isInteger(Number(value))||Number(value)<0))errors.push(prefix+f.label+'需為非負整數');
 if(!missing&&f.type==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||isNaN(Date.parse(value+'T00:00:00Z'))))errors.push(prefix+f.label+'日期不正確');
 if(!missing&&f.type==='url'&&!/^https:\/\//.test(value))errors.push(prefix+f.label+'需為HTTPS網址');
 if(typeof value==='string'&&value.length>(['need','intro','purpose'].includes(sec.id)?1000:3000))errors.push(prefix+f.label+'超過字數上限');
 });
 if(sec.id==='t5'&&row.methods?.includes('其他')&&!row.other?.trim())errors.push(prefix+'其他方法需說明');
 if(sec.id==='t6'&&row.equipment?.includes('其他')&&!row.other?.trim())errors.push(prefix+'其他設備需說明');
 if(sec.id==='t8'){if(row.methods?.includes('其他')&&!row.otherMethod?.trim())errors.push(prefix+'其他評量方式需說明');if(row.tools?.includes('其他')&&!row.otherTool?.trim())errors.push(prefix+'其他工具需說明');for(const k of ['methods','tools'])if(row[k]?.includes('無')&&row[k].length>1)errors.push(prefix+'「無」不能與其他選項並用');}
 if(sec.id==='t12'&&row.enabled==='採用'&&(row.criterion==='不適用'||!row.standard?.trim()))errors.push(prefix+'採用項目需寫明結訓標準');
 if(row.start&&row.end&&row.end<row.start)errors.push(prefix+'結束日期不得早於開始日期');
 });
 if(sec.id==='t12'&&!rows.some(r=>r.enabled==='採用'))errors.push('至少採用一項結訓標準');
 if(sec.id==='t10'&&Number(content.qualified)>Number(content.finished))errors.push('結訓人數不可大於完訓人數');
 if(sec.id==='t10'&&Number(content.finished)>Number(content.participants))errors.push('完訓人數不可大於參訓人數');
 return errors;
}
function proposalErrors(d){
 const errors=[];for(const k of ['name','studentId','grade','className'])if(!d.student[k]?.trim())errors.push('學生資料：'+({name:'姓名',studentId:'學號',grade:'年級',className:'班級'}[k])+'必填');
 SCHEMA.forEach(s=>sectionErrors(s,d.sections[s.id]).forEach(e=>errors.push(s.title+'：'+e)));
 const sum=(d.sections.t4||[]).reduce((n,r)=>n+Number(r.hours||0),0),total=Number(d.sections.info?.hours||0);if(!Number.isFinite(sum)||Math.abs(sum-total)>0.001)errors.push('表4時數加總 '+sum+' 與課程總時數 '+total+' 不一致');
 const tasks=new Set((d.sections.t1||[]).map(r=>r.taskId));for(const row of d.sections.t2||[])if(!tasks.has(row.taskId))errors.push('表2任務代碼 '+row.taskId+' 未列於表1（每列先對應一個主要任務）');
 const ids=new Set((d.sections.t3||[]).map(r=>r.unitId));for(const key of ['t2','t4','t5','t6','t7','t8','t9','t11'])for(const row of d.sections[key]||[])if(!ids.has(row.unitId))errors.push(key.replace('t','表')+'單元代碼 '+row.unitId+' 未列於表3');
 for(const key of ['t1','t3']){const list=d.sections[key]||[],k=key==='t1'?'taskId':'unitId';if(new Set(list.map(r=>r[k])).size!==list.length)errors.push(key.replace('t','表')+'代碼不可重複');}
 return errors;
}
if(typeof module!=='undefined')module.exports={emptyValue,initialSection,sectionErrors,proposalErrors};
