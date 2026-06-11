// ============================================================
//  EASTAR 대외 간행물 e-Book — 데이터
//  여기만 편집하면 메인(index.html)과 뷰어에 자동 반영됩니다.
// ============================================================

// ----- ① 로딩 화면에 랜덤으로 표출할 이스타항공 사진 -----
//  assets/planes/ 폴더에 사진을 추가하고 아래 목록에 파일명을 적으면
//  진입 시 3초간 무작위 순서로 바뀌며 표출됩니다.
const LOADING_IMAGES = [
  "assets/planes/20250529_172614.png",
  "assets/planes/20250529_172634.png",
  "assets/planes/20250529_172701.png",
  "assets/planes/20250529_172717.png",
  "assets/planes/20250529_172733.png",
  "assets/planes/20250529_172748.png",
  "assets/planes/20250529_172803.png"
];

// ----- ② 메인 카테고리 (2개) -----
//  각 카테고리를 누르면 그 안의 간행물이 웹진 형태로 펼쳐집니다.
const CATEGORIES = [
  {
    id: "safety-pub",
    title: "안전정보 간행물",
    desc: "항공안전 관련 법령·간행물을 웹진으로 열람합니다.",
    cover: "assets/planes/20250529_172701.png"
  },
  {
    id: "safety-star",
    title: "객실안전정보툰 Safety Star",
    desc: "객실 안전 정보를 만화(툰)로 쉽고 재미있게 전합니다.",
    cover: "assets/planes/20250529_172733.png"
  }
];

// ----- ③ 간행물 목록 -----
//   ● PDF 뷰어형 (법령·보고서) : type "pdf",  file "doc.pdf"
//   ● 책 넘김형 (잡지·툰)       : type 생략,  pages 배열
//   category 값은 위 CATEGORIES 의 id 와 같아야 합니다.
const BOOKS = [
  // ===== 안전정보 간행물 =====
  {
    id: "aviation-safety-act",
    type: "pdf",
    category: "safety-pub",
    path: "books/aviation-safety-act",
    file: "doc.pdf",
    title: "항공안전법",
    subtitle: "법률 제21268호 (2025.12.30)",
    cover: "books/aviation-safety-act/cover.svg"
  },
  {
    id: "aviation-safety-decree",
    type: "pdf",
    category: "safety-pub",
    path: "books/aviation-safety-decree",
    file: "doc.pdf",
    title: "항공안전법 시행령",
    subtitle: "대통령령 제35869호 (2025.11.28)",
    cover: "books/aviation-safety-decree/cover.svg"
  },
  {
    id: "aviation-safety-rule",
    type: "pdf",
    category: "safety-pub",
    path: "books/aviation-safety-rule",
    file: "doc.pdf",
    title: "항공안전법 시행규칙",
    subtitle: "국토교통부령 제1262호 (2026.01.01)",
    cover: "books/aviation-safety-rule/cover.svg"
  },

  // ===== 객실안전정보툰 Safety Star (기내 안전 정보 툰) =====
  {
    id: "safety-star-01", type: "pdf", category: "safety-star",
    path: "books/safety-star-01", file: "doc.pdf",
    title: "1화 · 세이프티 히어로즈", subtitle: "기내 안전 정보 툰",
    cover: "books/safety-star-01/cover.jpg"
  },
  {
    id: "safety-star-02", type: "pdf", category: "safety-star",
    path: "books/safety-star-02", file: "doc.pdf",
    title: "2화 · 보조배터리", subtitle: "기내 안전 정보 툰",
    cover: "books/safety-star-02/cover.jpg"
  },
  {
    id: "safety-star-03", type: "pdf", category: "safety-star",
    path: "books/safety-star-03", file: "doc.pdf",
    title: "3화 · 전자담배", subtitle: "기내 안전 정보 툰",
    cover: "books/safety-star-03/cover.jpg"
  },
  {
    id: "safety-star-04", type: "pdf", category: "safety-star",
    path: "books/safety-star-04", file: "doc.pdf",
    title: "4화 · 승객 탑승 준비", subtitle: "기내 안전 정보 툰",
    cover: "books/safety-star-04/cover.jpg"
  },
  {
    id: "safety-star-05", type: "pdf", category: "safety-star",
    path: "books/safety-star-05", file: "doc.pdf",
    title: "5화 · 탈출 상황에서는?", subtitle: "기내 안전 정보 툰",
    cover: "books/safety-star-05/cover.jpg"
  },
  {
    id: "safety-star-06", type: "pdf", category: "safety-star",
    path: "books/safety-star-06", file: "doc.pdf",
    title: "6화 · 승객 안전 브리핑", subtitle: "기내 안전 정보 툰",
    cover: "books/safety-star-06/cover.jpg"
  }
];

// index.html / viewer.html / pdf.html 에서 참조
window.LOADING_IMAGES = LOADING_IMAGES;
window.CATEGORIES = CATEGORIES;
window.BOOKS = BOOKS;
