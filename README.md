# 大四品質管理企劃教室

醫院／長照機構入職新人職能導向課程設計。每位學生個別填寫姓名、學號、年級與企劃，參考使用者提供的 iCAP ODT（未將原始文件上傳）。

- [線上填寫展示](https://chatgptcjcu-boop.github.io/healthcare-quality-course-planner/)
- [教學規劃](docs/teaching-plan.md)
- [GAS 建立及部署](docs/setup.md)

## 功能

12 表對應欄位、兩種教學範例、本機草稿、JSON 備份／匯入、列印、個別學生資料、課程代碼、Google Sheet 寫入與回執。表格採逐列文字輸入以支援不同單元數量；目前沒有檔案上傳及自動評分。

GAS 的 `setup()` 自動建立私人試算表。提交紀錄每列一份完整企劃，附學生資料與台灣時間；重送相同識別碼不重複寫入。成功回執須在寫入完成後才回傳。學號保存為文字，避免前導零遺失；文字避免被當成公式。

GitHub Pages 未設定後端時僅作展示，不會聲稱已存入 Sheet。GAS 網頁使用 `google.script.run`；GitHub Pages 可選擇以表單 POST 開啟回執頁，避免以不透明網路回應誤判成功。

## 維護

執行 `python3 build.py` 生成 index.html 與 apps-script/Index.html；修改生成來源後重新產生。執行 `node tests/server.test.cjs` 驗證收件邏輯。學習者資料、課程代碼、試算表 ID 不放入 GitHub。

## 使用邊界

這是教學企劃工具，不是 iCAP 正式申請系統或認證。兩種範例全為模擬、尚未試辦，數值不代表臨床標準。教師應審閱內容、告知學生保存期間並以校內政策管理個資；試算表只給教師。課程代碼降低隨機濫用，但不驗證真實學籍或防止代填；需要正式身分認證時另接校務登入。
