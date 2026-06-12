# EASTAR 대외 간행물 e-Book

여러 권의 간행물을 **책 넘김(page-flip)** 으로 보는 e-Book 서재 웹사이트입니다.
GitHub Pages로 무료 배포합니다. (난기류 지도와 동일한 방식)

---

## 📁 폴더 구조
```
ebook/
├─ index.html          ← 메인 (로딩 스플래시 + 카테고리 2개)
├─ flip.html           ← 웹진 플립북 뷰어 (PDF를 책장처럼 넘김) ★신규
├─ pdf.html            ← 문서 뷰어 (본문 검색·복사 — flip에서 🔍로 연결)
├─ viewer.html         ← 이미지 책 넘김 뷰어 (pages 배열형)
├─ books.js            ← 데이터 (로딩 이미지·카테고리·간행물 — 여기를 편집)
├─ assets/
│  ├─ style.css        ← 디자인
│  └─ planes/          ← 로딩 화면용 이스타항공 사진
└─ books/
   └─ aviation-safety-act/    ← PDF형
      ├─ doc.pdf              ← 원본 PDF
      └─ cover.svg            ← 표지
```

## 🖥️ 화면 흐름
1. **로딩 스플래시** — 진입 시 이스타항공 사진이 랜덤으로 바뀌며 3초간 표출 후 메인 전환
2. **메인** — 카테고리 2개: **안전정보 간행물** / **객실안전정보툰 Safety Star**
3. **카테고리 → 간행물 목록(웹진)** — 표지를 누르면
4. **웹진 뷰어(flip.html)** — 표지 + 전체 페이지 미리보기 → "넘겨보기 ▶" 로 실제 책처럼 넘김
   (대용량 PDF도 현재 보는 페이지 주변만 렌더링하여 가볍게 동작 · 한글 본문 검색은 🔍 버튼)

## 📚 책 두 종류
| 종류 | 적합한 자료 | 뷰어 | books.js 설정 |
|---|---|---|---|
| **책 넘김형** | 잡지·사보 (이미지) | viewer.html | `type` 생략, `pages` 배열 |
| **PDF형** | 법령·보고서 (글자 문서) | pdf.html | `type:"pdf"`, `file:"doc.pdf"` |

PDF형은 **이미지 변환이 필요 없고**, 브라우저에서 바로 열리며 **본문 검색**이 됩니다.
설치할 앱·플러그인이 없습니다.

## ✨ 기능
- 여러 권 라이브러리(서재) + 카테고리 필터 + 제목 검색
- 실제 책처럼 넘기는 page-flip (마우스 드래그 / ← → 키 / 슬라이더)
- 목차(TOC)로 점프, 썸네일 그리드로 점프
- 확대, 전체화면, 링크 공유, PDF 다운로드
- PC·태블릿·모바일 반응형

---

## 📖 책 추가하는 법 (3단계)

### 1) 페이지 이미지 준비
`books/<책ID>/pages/` 폴더를 만들고 페이지 이미지를 **순서대로** 넣습니다.
- 파일명: `01.jpg`, `02.jpg` … (맨 앞이 표지)
- JPG·PNG·SVG 모두 가능. 비율은 모두 같게(예: A4 1:1.414) 맞추면 가장 깔끔합니다.

**PDF 간행물인 경우** → 각 페이지를 이미지로 변환해서 넣습니다.
- 무료: ilovepdf.com 의 "PDF를 JPG로" 사용
- 또는 PDF를 폴더에 넣고 저(클로드)에게 알려주시면 변환·등록까지 자동으로 해 드립니다.
- (선택) 다운로드 버튼용으로 원본 PDF도 `books/<책ID>/` 안에 같이 넣으세요.

### 2) `books.js` 에 등록

**책 넘김형 (잡지·사보):**
```js
{
  id: "2026-summer",
  path: "books/2026-summer",
  title: "이스타 매거진",
  subtitle: "2026 여름호",
  category: "사보",
  cover: "books/2026-summer/pages/01.jpg",
  pages: ["01.jpg","02.jpg","03.jpg"],
  toc: [{ title:"신규 취항", page:3 }]
}
```

**PDF형 (법령·보고서) — 변환 없이 PDF만 넣으면 끝:**
```js
{
  id: "my-report",
  type: "pdf",                          // ← 이 줄이 핵심
  path: "books/my-report",
  file: "doc.pdf",                      // books/my-report/doc.pdf
  title: "안전 보고서",
  subtitle: "2026 1분기",
  category: "리포트",
  cover: "books/my-report/cover.svg"    // 표지 이미지 (없으면 직접 만들어 넣기)
}
```

### 3) 로컬에서 확인 — 「미리보기.bat」 더블클릭
**중요:** PDF 웹진은 `index.html` 을 그냥 더블클릭(`file://`)하면 브라우저 보안 정책상
PDF를 읽지 못해 "웹진을 불러오지 못했습니다" 가 뜹니다. (메인·로딩·표지는 보이지만 본문이 안 열림)

→ 같은 폴더의 **`미리보기.bat`** 을 더블클릭하면 간이 서버가 떠서 브라우저로 정상 표시됩니다.
   (Node.js 필요 · 종료는 검은 창 닫기) GitHub Pages 등 **웹주소로 배포하면 설치 없이 그대로 동작**합니다.
(라이브러리 일부 기능은 인터넷에서 불러오므로 온라인 상태여야 합니다)

---

## 🚀 GitHub 웹에서 배포하기 (설치 불필요)

### 1) 저장소 만들기
1. https://github.com 로그인 → 우측 상단 **＋ → New repository**
2. **Repository name**: 예 `eastar-ebook`
3. **Public** 선택 (Pages 무료 사용)  → **Create repository**

### 2) 파일 올리기
1. 새 저장소 화면에서 **uploading an existing file** 링크 클릭
   (또는 **Add file → Upload files**)
2. `ebook` 폴더 **안의 내용물**(index.html, viewer.html, books.js, assets, books)을
   통째로 드래그&드롭
   > ⚠️ `ebook` 폴더 자체가 아니라 **그 안의 파일들**을 올려야 주소가 깔끔합니다.
   > (폴더째 올리면 주소 끝에 `/ebook/` 이 붙습니다)
3. 아래 **Commit changes** 클릭

### 3) GitHub Pages 켜기
1. 저장소 상단 **Settings** → 왼쪽 메뉴 **Pages**
2. **Build and deployment → Source: Deploy from a branch**
3. **Branch: `main` / `(root)`** 선택 → **Save**
4. 1~2분 뒤 새로고침하면 상단에 공개 주소가 나옵니다:
   `https://<내아이디>.github.io/eastar-ebook/`

이 주소를 공유하면 누구나 PC·모바일에서 e-Book을 볼 수 있습니다.

### 책을 추가/수정한 뒤에는?
바뀐 파일만 GitHub 웹에서 다시 **Upload files** 하면 자동으로 사이트가 갱신됩니다.
(보통 1분 이내 반영)

---

## 🔧 관리자 기능 (admin.html)

관리자 콘솔(`admin.html`)에서 할 수 있는 일:
- **간행물 관리** — 추가/수정/삭제/순서변경 + 발행일(NEW 뱃지)·비공개(초안)·게시 예약일
- **카테고리 / 로딩 이미지 / 메인 공지 배너** 편집
- **파일 점검** — 모든 PDF·표지 존재 여부와 용량 자동 확인 (8MB 초과 경고)
- **바로 게시** — GitHub 토큰만 넣으면 books.js 커밋·PDF/표지 업로드까지 콘솔에서 완료
- **도구** — 간행물별 인쇄용 QR 생성(유입 태그 포함), PDF 1쪽으로 표지 자동 생성
- **간행물별 열람 통계** — 누적/월별 열람 수, 다운로드 수, 평균 도달률, 유입경로(QR 등)
- **접속현황** — Cloudflare 방문 통계 + CSV 보관

자동화(GitHub Actions — `.github/workflows/`):
- `validate` — 푸시할 때마다 books.js ↔ 실제 파일 정합성 검사 (`node scripts/validate-books.js` 로 로컬 실행도 가능)
- `uptime` — 30분마다 사이트 생존 확인, 접속 불가 시 GitHub이 메일 알림
- `stats-archive` — 매월 1일 방문통계 CSV를 `stats-archive/` 폴더에 자동 커밋

### 1회 설정 (관리자)
1. **간행물별 통계 (KV)** — Cloudflare 대시보드 → Workers & Pages → KV → 네임스페이스 생성(예: `eastarjet-ebook-stats`) → Pages 프로젝트 → Settings → **Bindings → KV namespace** 추가, Variable name 은 반드시 `EB_STATS` → 재배포(Retry deployment)
2. **바로 게시 (GitHub 토큰)** — github.com → Settings → Developer settings → **Fine-grained personal access tokens** → 이 저장소만 선택 → Repository permissions 에서 **Contents: Read and write** → 발급된 토큰을 관리자 콘솔의 토큰 칸에 입력 (브라우저에만 저장됨)
3. **방문 통계 API** — (기존) Cloudflare Pages 환경변수 `CF_API_TOKEN` (Account Analytics: Read)

※ 예약 실행(uptime·stats-archive)은 저장소에 60일간 커밋이 없으면 GitHub이 자동 중지합니다. 안내 메일이 오면 Actions 탭에서 Enable 만 누르면 재개됩니다.

## ❓ 자주 막히는 곳
- **책이 안 보여요** → `books.js` 의 `path`/`pages` 파일명이 실제 폴더와 정확히 같은지(대소문자 포함) 확인
- **이미지가 안 떠요** → 파일명 공백·한글보다 `01.jpg` 같은 영문/숫자 권장
- **표지만 보이고 안 넘어가요** → 페이지가 1장뿐. 2장 이상이어야 넘김 동작
