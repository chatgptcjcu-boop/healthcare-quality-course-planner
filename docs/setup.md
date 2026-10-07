# 用 GAS 自動建立 Google Sheet

1. 在 Google Apps Script 建立專案，命名「大四品質管理企劃教室」。
2. 將 `apps-script/Code.gs` 貼入程式碼檔；新增 HTML 檔 `Index`，貼入 `apps-script/Index.html`。
3. 執行 `setup()`。Google 首次會要求試算表授權，教師自行審閱並授權。函式自動建立私人試算表，於執行紀錄顯示試算表網址和課程代碼；重跑不會重建。
4. 部署 → 新增部署 → 網頁應用程式。執行身分選自己；依學校帳號可用設定選學生可存取的範圍。不要公開試算表。取得 `/exec` 網址。
5. 學生可直接開啟 GAS 網址並填寫。若要從 GitHub Pages 直接送出，在 build.py 的 `WEB_APP_URL` 填入該網址，再重新生成及推送；網址本身不是秘密，課程代碼不能寫入原始碼。
6. 教師私下提供課程代碼。`CLASS_CODE` 可在專案設定的指令碼屬性中輪換；不要以空值開放提交。
7. 用虛構姓名與學號 `00001234` 完成一次提交，確認有回執且 Sheet 新增一列；確認學號前導零保留；重送同一識別碼應同一回執、沒有重複列；錯誤代碼不得新增列。測試紀錄保留清楚的 TEST 標記或由教師刪除。
8. Apps Script 原生網頁每次成功後產生新的提交識別碼；再次提交是新版本。GitHub Pages 回執另開視窗，原頁無法驗證回執，應下載新備份／重開新版企劃來產生新識別碼（目前相同識別碼視為重送）。

## 欄位及保護

每份作業只限一位學生。提交者不能讀取任何既有學生作業；後端只回傳此次回執與時間。課程代碼存於指令碼屬性，與私人 SHEET_ID 分離於公開程式碼之外。以鎖避免並發重複寫入，伺服器驗證必填與字數。

本機草稿包含姓名學號；共用電腦使用後清除。教師應依學校政策設定保存期限及通知方式，勿將學生試算表公開。課程代碼不是學籍驗證，正式評量需教師核對名冊。

## 參考文件

- [Google Apps Script 網頁應用程式](https://developers.google.com/apps-script/guides/web)
- [HTML service 與伺服器通訊](https://developers.google.com/apps-script/guides/html/communication)
- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## 本次建置狀態（2026-10-07）

已在教師帳戶建立 [大四品質管理企劃教室 GAS 專案](https://script.google.com/home/projects/1r3q-Lak_jsl3hTfxBC2m1tAUTM3E6AAlaaxzFxnp6vmdxdBwtt8vHRp3/edit)，程式已儲存。該專案使用 Code-github.gs.example 的等效程式：從固定 GitHub 提交讀取公開 HTML，不向 GitHub 傳送學生資料；另需外部請求權限。

首次執行 setup 時 Google 顯示「系統已封鎖這個應用程式」，未完成授權，故沒有建立試算表、未部署 /exec、未做真實寫入驗證。需帳戶持有人依 Google 帳戶或機構政策處理 Apps Script 授權阻擋。不要以改網址等方式繞過阻擋。處理後再執行 setup、部署，並完成上列實際測試。

若希望免除外部讀取，改用 Code.gs 和本地 Index.html 的雙檔方式；仍需要 Google 試算表授權。
