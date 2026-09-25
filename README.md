# Frank & Hongchen Wedding Website — v2

婚禮邀請網站：**2027/02/21**，**高雄日航酒店 Hotel Nikko Kaohsiung 3F 宴會廳**。

此版本已依 2026-09-25 更新後的 Google Form 設定重新整理：

- Google Forms 內建「收集電子郵件地址」已關閉。
- Google Form 後台的「出席人數」與「飲食需求」為選填。
- 網站前端仍會在賓客選擇「會出席」時，要求填寫「出席人數」與「飲食需求」。
- 「兒童座椅」為出席者選填，僅提供 1 / 2 張。
- 「聯絡電話」與「紙本喜帖寄送地址」為選填。
- 網站上的「電子喜帖 Email」維持必填。

## 專案檔案

- `index.html` — 頁面內容、婚禮資訊與 RSVP 表單
- `styles.css` — Editorial × Minimal Luxury 視覺、手機版響應式設計
- `script.js` — 倒數、條件式 RSVP、前端驗證與 Google Forms 背景送出
- `assets/hero.webp` — 首頁夕陽海岸主視覺

## Google Form 欄位對照

| 網站欄位 | Google Forms entry ID |
|---|---|
| 姓名 | `entry.927453179` |
| 與新人關係 | `entry.1106889850` |
| 聯絡電話 | `entry.1733092392` |
| 是否出席 | `entry.579093535` |
| 出席人數 | `entry.728428873` |
| 兒童座椅 | `entry.690583584` |
| 飲食需求 | `entry.607079424` |
| 電子喜帖 Email | `entry.660573787` |
| 紙本喜帖寄送地址 | `entry.538163172` |
| 留言 | `entry.124137914` |

Google Form 提交端點：

`https://docs.google.com/forms/d/e/1FAIpQLScWM123oqjrmjeIUcYOFqejIVUqNSd7WJ9F2H-d0DDwabktpQ/formResponse`

## RSVP 邏輯

賓客選「會出席」時，網站才顯示並要求：

- 出席人數：1 / 2 / 3 / 4
- 飲食需求：葷食 / 素食
- 兒童座椅：1 / 2 張（選填）

選「很遺憾無法出席」時，上述欄位會隱藏、清空並停止送出，避免 Google Form 收到不適用資料。

## GitHub Pages 發布

1. 建立新的 GitHub Repository，例如 `wedding`。
2. 將本資料夾內的 **所有檔案與 `assets` 資料夾** 上傳到 Repository 根目錄。
3. GitHub Repository → `Settings` → `Pages`。
4. `Build and deployment` 選 `Deploy from a branch`。
5. Branch 選 `main`，Folder 選 `/ (root)`，按 `Save`。
6. 等待 GitHub 建置後即可取得類似：`https://YOUR-USERNAME.github.io/wedding/` 的網址。

## 正式發送前測試

請至少從 GitHub Pages 正式網址送出一次「會出席」與一次「無法出席」測試，並至 Google Form / Google Sheets 確認欄位資料正確。

## 目前網站設定

- 新郎：Frank／蕭文暐
- 新娘：Hongchen／陳虹蓁
- 婚禮日期：2027/02/21（日）
- 迎賓：11:30
- 開席：12:00
- 地點：高雄日航酒店 3F 宴會廳
- RSVP 截止：2026/11/30
- 英文標語：**Together, from this day forward.**
- 中文標語：**從今以後，一起走向每一個日常。**


## v3 RSVP 條件式邏輯

- 選擇「會出席」：出席人數、飲食需求、電子喜帖 Email 為必填；兒童座椅與紙本喜帖地址為選填。
- 選擇「很遺憾無法出席」：上述出席相關欄位會隱藏、清空並停用，不會送至 Google Form。
- 「聯絡電話」與「想對我們說的話」無論是否出席都維持選填。
