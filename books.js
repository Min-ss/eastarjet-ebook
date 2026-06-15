// ============================================================
//  EASTAR 대외 간행물 e-Book — 데이터
//  (관리자 콘솔에서 생성됨)
//  새 PDF는 books/<폴더ID>/doc.pdf, 표지는 books/<폴더ID>/cover.* 로 넣으세요.
//  간행물 선택 필드: date(발행일→NEW 뱃지) · published:false(비공개) · publishAt(게시 예약일)
// ============================================================

const LOADING_IMAGES = [
  "assets/planes/20250529_172614.png",
  "assets/planes/20250529_172634.png",
  "assets/planes/20250529_172701.png",
  "assets/planes/20250529_172717.png",
  "assets/planes/20250529_172733.png",
  "assets/planes/20250529_172748.png",
  "assets/planes/20250529_172803.png"
];

const NOTICE = {
  "enabled": false,
  "text": "",
  "link": "",
  "until": ""
};

const SITE = {
  "brandTitle": "대외 간행물 e-Book",
  "heroTitle": "대외 간행물",
  "heroSubtitle": "카테고리를 선택하면 간행물을 웹진 형태로 열람할 수 있습니다."
};

const CATEGORIES = [
  {
    "id": "safety-pub",
    "title": "안전정보 간행물",
    "desc": "항공안전 관련 간행물을 열람합니다.",
    "cover": "assets/planes/20250529_172701.png"
  },
  {
    "id": "safety-star",
    "title": "객실안전정보툰 Safety Star",
    "desc": "객실안전정보를 만화로 쉽게 전합니다.",
    "cover": "assets/planes/20250529_172733.png"
  },
  {
    "id": "safety-law",
    "title": "항공안전 관련 법령",
    "desc": "항공안전 관련 법령을 열람합니다.",
    "cover": "assets/planes/20250529_172614.png",
    "coverBook": "aviation-safety-act"
  }
];

const BOOKS = [
  {
    "id": "safety-star-mag-01",
    "type": "pdf",
    "category": "safety-pub",
    "path": "books/safety-star-mag-01",
    "file": "doc.pdf",
    "title": "SAFETY STAR Rev.01",
    "subtitle": "안전정보 간행물",
    "cover": "books/safety-star-mag-01/cover.png"
  },
  {
    "id": "safety-star-mag-02",
    "type": "pdf",
    "category": "safety-pub",
    "path": "books/safety-star-mag-02",
    "file": "doc.pdf",
    "title": "SAFETY STAR Rev.02",
    "subtitle": "안전정보 간행물",
    "cover": "books/safety-star-mag-02/cover.png"
  },
  {
    "id": "safety-star-mag-03",
    "type": "pdf",
    "category": "safety-pub",
    "path": "books/safety-star-mag-03",
    "file": "doc.pdf",
    "title": "SAFETY STAR Rev.03",
    "subtitle": "안전정보 간행물",
    "cover": "books/safety-star-mag-03/cover.png"
  },
  {
    "id": "safety-star-mag-04",
    "type": "pdf",
    "category": "safety-pub",
    "path": "books/safety-star-mag-04",
    "file": "doc.pdf",
    "title": "SAFETY STAR Rev.04",
    "subtitle": "안전정보 간행물",
    "cover": "books/safety-star-mag-04/cover.png"
  },
  {
    "id": "safety-star-mag-05",
    "type": "pdf",
    "category": "safety-pub",
    "path": "books/safety-star-mag-05",
    "file": "doc.pdf",
    "title": "SAFETY STAR Rev.05",
    "subtitle": "안전정보 간행물",
    "cover": "books/safety-star-mag-05/cover.png"
  },
  {
    "id": "safety-star-mag-06",
    "type": "pdf",
    "category": "safety-pub",
    "path": "books/safety-star-mag-06",
    "file": "doc.pdf",
    "title": "SAFETY STAR Rev.06",
    "subtitle": "안전정보 간행물",
    "cover": "books/safety-star-mag-06/cover.png"
  },
  {
    "id": "safety-star-01",
    "type": "pdf",
    "category": "safety-star",
    "path": "books/safety-star-01",
    "file": "doc.pdf",
    "title": "1화 · 세이프티 히어로즈",
    "subtitle": "기내 안전 정보 툰",
    "cover": "books/safety-star-01/cover.jpg"
  },
  {
    "id": "safety-star-02",
    "type": "pdf",
    "category": "safety-star",
    "path": "books/safety-star-02",
    "file": "doc.pdf",
    "title": "2화 · 보조배터리",
    "subtitle": "기내 안전 정보 툰",
    "cover": "books/safety-star-02/cover.jpg"
  },
  {
    "id": "safety-star-03",
    "type": "pdf",
    "category": "safety-star",
    "path": "books/safety-star-03",
    "file": "doc.pdf",
    "title": "3화 · 전자담배",
    "subtitle": "기내 안전 정보 툰",
    "cover": "books/safety-star-03/cover.jpg"
  },
  {
    "id": "safety-star-04",
    "type": "pdf",
    "category": "safety-star",
    "path": "books/safety-star-04",
    "file": "doc.pdf",
    "title": "4화 · 승객 탑승 준비",
    "subtitle": "기내 안전 정보 툰",
    "cover": "books/safety-star-04/cover.jpg"
  },
  {
    "id": "safety-star-05",
    "type": "pdf",
    "category": "safety-star",
    "path": "books/safety-star-05",
    "file": "doc.pdf",
    "title": "5화 · 탈출 상황에서는?",
    "subtitle": "기내 안전 정보 툰",
    "cover": "books/safety-star-05/cover.jpg"
  },
  {
    "id": "safety-star-06",
    "type": "pdf",
    "category": "safety-star",
    "path": "books/safety-star-06",
    "file": "doc.pdf",
    "title": "6화 · 승객 안전 브리핑",
    "subtitle": "기내 안전 정보 툰",
    "cover": "books/safety-star-06/cover.jpg"
  },
  {
    "id": "aviation-safety-act",
    "type": "pdf",
    "category": "safety-law",
    "path": "books/aviation-safety-act",
    "file": "doc.pdf",
    "title": "항공안전법",
    "subtitle": "법률 제21268호 (2025.12.30)",
    "cover": "books/aviation-safety-act/cover.svg"
  },
  {
    "id": "aviation-safety-decree",
    "type": "pdf",
    "category": "safety-law",
    "path": "books/aviation-safety-decree",
    "file": "doc.pdf",
    "title": "항공안전법 시행령",
    "subtitle": "대통령령 제35869호 (2025.11.28)",
    "cover": "books/aviation-safety-decree/cover.svg"
  },
  {
    "id": "aviation-safety-rule",
    "type": "pdf",
    "category": "safety-law",
    "path": "books/aviation-safety-rule",
    "file": "doc.pdf",
    "title": "항공안전법 시행규칙",
    "subtitle": "국토교통부령 제1262호 (2026.01.01)",
    "cover": "books/aviation-safety-rule/cover.svg"
  }
];

window.LOADING_IMAGES = LOADING_IMAGES;
window.NOTICE = NOTICE;
window.SITE = SITE;
window.CATEGORIES = CATEGORIES;
window.BOOKS = BOOKS;
