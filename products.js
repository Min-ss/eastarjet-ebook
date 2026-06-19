// ============================================================
//  EASTAR SHOP — 판매상품 데이터
//  (관리자 콘솔의 「SHOP 상품 관리」에서 생성됨)
//  상품 이미지는 shop/<상품ID>/img.* 로 업로드됩니다.
//  상품 선택 필드: category(카테고리 ID) · published:false(비공개) ·
//                  soldOut:true(품절) · badge(뱃지 문구)
//  가격은 원(KRW) 숫자. salePrice 가 있으면 정가(price)에 취소선이 표시됩니다.
// ============================================================

const SHOP = {
  "title": "E-Shop",
  "subtitle": "이스타항공 공식 상품을 만나보세요.",
  "hero": {
    "headline": "",
    "sub": "",
    "image": "assets/planes/plane-05.jpg",
    "link": ""
  },
  "notice": {
    "enabled": false,
    "text": "",
    "link": "",
    "until": ""
  }
};

const SHOP_CATEGORIES = [
  {
    "id": "model",
    "name": "모형 항공기"
  },
  {
    "id": "living",
    "name": "리빙"
  },
  {
    "id": "goods",
    "name": "굿즈"
  },
  {
    "id": "peanuts",
    "name": "피너츠",
    "parent": "goods"
  },
  {
    "id": "donothing",
    "name": "미스터두낫띵",
    "parent": "goods"
  },
  {
    "id": "bamkel",
    "name": "BAMKEL",
    "parent": "goods"
  }
];

const PRODUCTS = [
  {
    "id": "es-61",
    "name": "[이스타항공] 모형 항공기 (1:300)",
    "category": "model",
    "price": 39900,
    "salePrice": 29000,
    "image": "shop/es-61/img.png",
    "desc": "모형 항공기 1:300 - 디테일한 항공 팬 아이템",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-모형-항공기-1300/61/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-60",
    "name": "[이스타항공] 엔스브릭 조종석 쿠빅",
    "category": "model",
    "price": 22000,
    "salePrice": 19000,
    "image": "shop/es-60/img.png",
    "desc": "엔스브릭 조종석 쿠빅 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-엔스브릭-조종석-쿠빅/60/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-38",
    "name": "[이스타항공] 이스타항공 비행기 블럭 옥스포드 블럭 B737-8",
    "category": "model",
    "price": 35000,
    "salePrice": 29000,
    "image": "shop/es-38/img.png",
    "desc": "이스타항공 비행기 블럭 옥스포드 B737-8 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-이스타항공-비행기-블럭-옥스포드-블럭-b737-8/38/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-63",
    "name": "[이스타항공] 메탈 카드키링",
    "category": "living",
    "price": 20000,
    "salePrice": 10000,
    "image": "shop/es-63/img.png",
    "desc": "메탈 카드키링 - 이스타항공 로고가 새겨진 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-메탈-카드키링/63/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-52",
    "name": "[이스타항공] 에어프레임 미니 거울",
    "category": "living",
    "price": 15000,
    "salePrice": 12000,
    "image": "shop/es-52/img.png",
    "desc": "에어프레임 미니 거울 - 비행기창문 모티브 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-에어프레임-미니-거울/52/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-46",
    "name": "[이스타항공] 이스타키링",
    "category": "living",
    "price": 15000,
    "salePrice": 10000,
    "image": "shop/es-46/img.png",
    "desc": "이스타키링 - 여행 테마 키링 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-이스타키링/46/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-45",
    "name": "[이스타항공] 미니 보냉백",
    "category": "living",
    "price": 20000,
    "salePrice": 17000,
    "image": "shop/es-45/img.jpg",
    "desc": "미니 보냉백 - 이스타항공 브랜드 보냉 가방 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-미니-보냉백/45/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-43",
    "name": "[이스타항공] 이스타담요",
    "category": "living",
    "price": 25000,
    "salePrice": 22000,
    "image": "shop/es-43/img.jpg",
    "desc": "이스타담요 - 여행 중 휴식을 위한 편안한 담요 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-이스타담요/43/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-53",
    "name": "[이스타항공] 이스타 리유저블백",
    "category": "goods",
    "price": 10000,
    "salePrice": 8000,
    "image": "shop/es-53/img.jpg",
    "desc": "이스타 리유저블백 - 스타일리시하고 실용적인 가방 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-이스타-리유저블백/53/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-34",
    "name": "[이스타항공] 항공기 뱃지",
    "category": "goods",
    "price": 8000,
    "salePrice": 7000,
    "image": "shop/es-34/img.png",
    "desc": "이스타항공 항공기 뱃지 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-항공기-뱃지/34/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-33",
    "name": "[이스타항공] 737-8 엔진 뱃지",
    "category": "goods",
    "price": 8000,
    "salePrice": 7000,
    "image": "shop/es-33/img.png",
    "desc": "737-8 엔진 뱃지 - 이스타항공 기념품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-737-8-엔진-뱃지/33/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-31",
    "name": "[이스타항공] 기내반입용 펫케이지",
    "category": "goods",
    "price": 67000,
    "salePrice": 43000,
    "image": "shop/es-31/img.png",
    "desc": "펫케이지 기내반입용 - 강아지와 고양이를 위한 펫가방 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-기내반입용-펫케이지/31/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-58",
    "name": "[피너츠 X 이스타항공] 굿즈 세트",
    "category": "peanuts",
    "price": 30000,
    "image": "shop/es-58/img.jpg",
    "desc": "피너츠 X 이스타항공 굿즈 세트 - 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/피너츠-x-이스타항공-굿즈-세트/58/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-57",
    "name": "[피너츠 X 이스타항공] 똑딱이 담요",
    "category": "peanuts",
    "price": 19000,
    "image": "shop/es-57/img.jpg",
    "desc": "피너츠 X 이스타항공 똑딱이 담요 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/피너츠-x-이스타항공-똑딱이-담요/57/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-56",
    "name": "[피너츠 X 이스타항공] 캐리어택",
    "category": "peanuts",
    "price": 8000,
    "image": "shop/es-56/img.jpg",
    "desc": "피너츠 X 이스타항공 캐리어택 이미지",
    "buyUrl": "https://eastarjetshop.com/product/피너츠-x-이스타항공-캐리어택/56/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-55",
    "name": "[피너츠 X 이스타항공] 핀뱃지",
    "category": "peanuts",
    "price": 5000,
    "image": "shop/es-55/img.jpg",
    "desc": "피너츠 X 이스타항공 핀뱃지 - 귀여운 캐릭터 디자인의 핀뱃지 이미지",
    "buyUrl": "https://eastarjetshop.com/product/피너츠-x-이스타항공-핀뱃지/55/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-59",
    "name": "[이스타항공X미스터두낫띵] 엔지니어 피규어",
    "category": "donothing",
    "price": 37000,
    "image": "shop/es-59/img.png",
    "desc": "엔지니어 피규어 - 이스타항공과 미스터두낫띵 협업 디자인",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공x미스터두낫띵-엔지니어-피규어/59/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-54",
    "name": "[이스타항공X미스터두낫띵] Big sticker 6종",
    "category": "donothing",
    "price": 6000,
    "salePrice": 5000,
    "image": "shop/es-54/img.jpg",
    "desc": "이스타항공X미스터두낫띵 Big sticker 6종 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공x미스터두낫띵-big-sticker-6종/54/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-51",
    "name": "[이스타항공X미스터두낫띵] 띠부띠부씰 4종",
    "category": "donothing",
    "price": 5000,
    "salePrice": 3000,
    "image": "shop/es-51/img.jpg",
    "desc": "띠부띠부씰 4종 - 특별한 콜라보레이션 기념품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공x미스터두낫띵-띠부띠부씰-4종/51/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-32",
    "name": "[이스타항공] 미스터두낫띵 X 이스타항공 리유저블백",
    "category": "donothing",
    "price": 10000,
    "salePrice": 7000,
    "image": "shop/es-32/img.png",
    "desc": "미스터두낫띵 X 이스타항공 리유저블백 - 여행에 적합한 스타일리시한 제품 이미지",
    "buyUrl": "https://eastarjetshop.com/product/이스타항공-미스터두낫띵-x-이스타항공-리유저블백/32/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-41",
    "name": "[BAMKEL X 이스타항공] 밤켈 핸드폰 방수팩 케이스",
    "category": "bamkel",
    "price": 20000,
    "salePrice": 12000,
    "image": "shop/es-41/img.jpg",
    "desc": "밤켈 X 이스타항공 핸드폰 방수팩 케이스 이미지",
    "buyUrl": "https://eastarjetshop.com/product/bamkel-x-이스타항공-밤켈-핸드폰-방수팩-케이스/41/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-37",
    "name": "[BAMKEL X 이스타항공] 밤켈 방수 드라이백 백팩 45L",
    "category": "bamkel",
    "price": 89000,
    "salePrice": 69000,
    "image": "shop/es-37/img.jpg",
    "desc": "밤켈 방수 드라이백 백팩 45L - ROLL-TOP 구조와 FOLD SEAL 시스템 이미지",
    "buyUrl": "https://eastarjetshop.com/product/bamkel-x-이스타항공-밤켈-방수-드라이백-백팩-45l/37/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-36",
    "name": "[BAMKEL X 이스타항공] 밤켈 드라이백 아웃도어 물놀이 방수가방 15L",
    "category": "bamkel",
    "price": 25000,
    "salePrice": 20000,
    "image": "shop/es-36/img.png",
    "desc": "밤켈 드라이백 아웃도어 물놀이 방수가방 15L 이미지",
    "buyUrl": "https://eastarjetshop.com/product/bamkel-x-이스타항공-밤켈-드라이백-아웃도어-물놀이-방수가방-15l/36/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  },
  {
    "id": "es-30",
    "name": "[BAMKELX이스타항공] 밤켈 리트레 텀블러",
    "category": "bamkel",
    "price": 39000,
    "salePrice": 29000,
    "image": "shop/es-30/img.png",
    "desc": "밤켈 리트레 빨대 텀블러 - 검정색 대용량 텀블러 이미지",
    "buyUrl": "https://eastarjetshop.com/product/bamkelx이스타항공-밤켈-리트레-텀블러/30/category/42/display/1/",
    "badge": "",
    "soldOut": false,
    "published": true
  }
];

window.SHOP = SHOP;
window.SHOP_CATEGORIES = SHOP_CATEGORIES;
window.PRODUCTS = PRODUCTS;
