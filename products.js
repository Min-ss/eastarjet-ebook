// ============================================================
//  EASTAR SHOP — 판매상품 데이터
//  (관리자 콘솔의 「SHOP 상품 관리」에서 생성됨)
//  상품 이미지는 shop/<상품ID>/img.* 로 업로드됩니다.
//  상품 선택 필드: category(카테고리 ID) · published:false(비공개) ·
//                  soldOut:true(품절) · badge(뱃지 문구)
//  가격은 원(KRW) 숫자. salePrice 가 있으면 정가(price)에 취소선이 표시됩니다.
// ============================================================

const SHOP = {
  "title": "Eastar SHOP",
  "subtitle": "이스타항공 공식 상품을 만나보세요.",
  "hero": {
    "headline": "이스타항공 공식 굿즈",
    "sub": "하늘 위의 설렘을 일상에서도. 한정 상품을 만나보세요.",
    "image": "assets/planes/plane-05.jpg",
    "link": ""
  },
  "notice": { "enabled": false, "text": "", "link": "", "until": "" }
};

const SHOP_CATEGORIES = [
  { "id": "model", "name": "모형 항공기" },
  { "id": "goods", "name": "굿즈" },
  { "id": "living", "name": "리빙" },
  { "id": "apparel", "name": "의류" }
];

// 샘플 상품 — 관리자 콘솔에서 실제 상품으로 교체/삭제하세요.
const PRODUCTS = [
  {
    "id": "sample-goods-01",
    "name": "이스타항공 1:200 모형 항공기",
    "category": "model",
    "price": 39000,
    "salePrice": 29000,
    "image": "assets/planes/plane-03.jpg",
    "desc": "데스크 위에 두는 1:200 다이캐스트 모형 항공기.",
    "detail": "정교하게 재현한 이스타항공 1:200 스케일 다이캐스트 모형 항공기입니다. 받침대 포함 구성으로 데스크나 진열장 어디에나 잘 어울립니다.",
    "buyUrl": "",
    "badge": "BEST",
    "soldOut": false,
    "published": true
  },
  {
    "id": "sample-goods-02",
    "name": "기내 안전 굿즈 세트",
    "category": "goods",
    "price": 18000,
    "image": "assets/planes/plane-08.jpg",
    "desc": "Safety Star 캐릭터 스티커·키링이 담긴 굿즈 세트.",
    "detail": "객실 안전 캠페인 캐릭터 'Safety Star' 스티커와 키링으로 구성된 굿즈 세트입니다.",
    "buyUrl": "",
    "badge": "NEW",
    "soldOut": false,
    "published": true
  },
  {
    "id": "sample-goods-03",
    "name": "이스타항공 텀블러",
    "category": "living",
    "price": 22000,
    "image": "assets/planes/plane-12.jpg",
    "desc": "휴대하기 좋은 보온·보냉 스테인리스 텀블러.",
    "detail": "이중 진공 구조로 보온·보냉이 우수한 스테인리스 텀블러입니다. 이스타항공 로고가 각인되어 있습니다.",
    "buyUrl": "",
    "badge": "",
    "soldOut": true,
    "published": true
  },
  {
    "id": "sample-goods-04",
    "name": "이스타항공 캐리어 네임택",
    "category": "goods",
    "price": 9000,
    "image": "assets/planes/plane-15.jpg",
    "desc": "여행 가방에 다는 가죽 네임택.",
    "detail": "PU 가죽 소재의 캐리어 네임택입니다. 분실 방지와 포인트를 동시에.",
    "buyUrl": "",
    "badge": "",
    "soldOut": false,
    "published": true
  }
];

window.SHOP = SHOP;
window.SHOP_CATEGORIES = SHOP_CATEGORIES;
window.PRODUCTS = PRODUCTS;
