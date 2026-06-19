// ============================================================
//  Eastar SHOP 자동 동기화 — 자사몰(eastarjetshop.com, Cafe24)의 굿즈를
//  긁어 products.js(상품·카테고리)를 재생성하고 이미지를 shop/ 에 저장합니다.
//  · 여행상품(호텔·액티비티·골프) 카테고리는 제외
//  · SHOP 메타(제목·소개·히어로·공지)는 기존 products.js 값을 보존
//  · 의존성 없음(Node 18+ 내장 fetch). GitHub Actions(sync-shop.yml)에서 정기 실행.
//  로컬 실행:  node scripts/sync-shop.js
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BASE = 'https://eastarjetshop.com';
const UA = 'Mozilla/5.0 (compatible; EastarShopSync/1.0; +https://eastarjet-ebook.pages.dev)';
const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_JS = path.join(ROOT, 'products.js');
const SHOP_DIR = path.join(ROOT, 'shop');

// 제외할 여행 카테고리 ID (호텔·액티비티·골프) — 자사몰 카테고리 번호
const TRAVEL_CATS = new Set(['79', '80', '81', '92', '93', '94', '118', '127', '128']);
const ALL_CAT = '42';   // 전체상품

// 콜라보 브랜드 → '굿즈'의 하위 카테고리(parent: goods). 키워드 분류보다 우선.
const COLLAB_RULES = [
  { id: 'peanuts',   name: '피너츠',       parent: 'goods', kw: /피너츠|peanuts|스누피/i },
  { id: 'donothing', name: '미스터두낫띵', parent: 'goods', kw: /미스터두낫띵|두낫띵|do\s?nothing/i },
  { id: 'bamkel',    name: 'BAMKEL',       parent: 'goods', kw: /bamkel|밤켈/i },
];

// 자체 굿즈 키워드 → SHOP 상위 카테고리 (콜라보가 아닐 때 적용)
const CAT_RULES = [
  { id: 'model',   name: '모형 항공기', kw: /모형|블럭|블록|엔스브릭|쿠빅|피규어|미니어처/ },
  { id: 'living',  name: '리빙',       kw: /담요|보냉백|텀블러|블랭킷|거울|미러|키링|카드키링|네임택|캐리어택|보틀|컵|머그|쿠션|파우치|보냉|보온/ },
  { id: 'apparel', name: '의류',       kw: /의류|티셔츠|후드|모자|캡|양말|에코백|니트|맨투맨|반팔|긴팔/ },
  { id: 'goods',   name: '굿즈',       kw: /.*/ },   // 기본값(자체 굿즈)
];

// 미등록 콜라보 자동 인식: 상품명의 "브랜드 X 이스타항공" / "이스타항공 X 브랜드" 패턴에서
// 이스타항공이 아닌 쪽 브랜드를 추출해 '굿즈' 하위 카테고리로 자동 편성한다.
function genericCollab(name) {
  const head = (name.match(/^\[([^\]]+)\]/) || [])[1] || name.split(/\s+/).slice(0, 5).join(' ');
  const m = head.match(/([0-9A-Za-z가-힣.&'’\s]{1,30}?)\s*[xX×]\s*이스타\s*항공/)
         || head.match(/이스타\s*항공\s*[xX×]\s*([0-9A-Za-z가-힣.&'’\s]{1,30})/);
  if (!m) return null;
  const brand = m[1].replace(/[\[\]]/g, '').trim();
  if (!brand || /이스타/.test(brand)) return null;
  const id = 'collab-' + brand.toLowerCase().replace(/[^0-9a-z가-힣]+/g, '-').replace(/^-+|-+$/g, '');
  return id === 'collab-' ? null : { id, name: brand, parent: 'goods' };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getText(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.text();
    } catch (e) {
      if (i === 2) throw new Error(`fetch 실패: ${url} — ${e.message}`);
      await sleep(800);
    }
  }
}

// 카테고리 한 개의 모든 상품 블록을 페이지네이션으로 수집
async function fetchCategory(catUrl) {
  const out = [];
  const seen = new Set();
  for (let page = 1; page <= 12; page++) {
    const sep = catUrl.includes('?') ? '&' : '?';
    const html = await getText(`${catUrl}${sep}page=${page}`);
    const blocks = html.split(/<li id="anchorBoxId_/).slice(1);
    let fresh = 0;
    for (const b of blocks) {
      const id = (b.match(/^(\d+)/) || [])[1];
      if (!id || seen.has(id)) continue;
      seen.add(id); fresh++;
      const href = (b.match(/\/product\/[^"]+/) || [])[0] || '';
      const catId = (href.match(/category\/(\d+)\//) || [])[1] || '';
      const custom = (b.match(/ec-data-custom="(\d+)"/) || [])[1] || '';
      const price = (b.match(/ec-data-price="(\d+)"/) || [])[1] || '';
      const nameM = b.match(/<div class="name">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      const name = nameM ? nameM[1].replace(/<[^>]+>/g, '').replace(/상품명\s*:/, '').replace(/\s+/g, ' ').trim() : '';
      const img = (b.match(/\/\/ecimg\.cafe24img\.com[^"?]+/) || [])[0] || '';
      const alt = (b.match(/alt="([^"]{4,120})"/) || [])[1] || '';
      const soldOut = /품절|sold\s?out|일시품절/i.test(b.slice(0, 1500));
      out.push({ id, name, href, catId, custom, price, img, alt, soldOut });
    }
    if (fresh === 0) break;   // 더 이상 새 상품 없음
    await sleep(300);
  }
  return out;
}

function categorize(name) {
  for (const r of COLLAB_RULES) if (r.kw.test(name)) return r;   // 등록된 콜라보 우선
  const g = genericCollab(name); if (g) return g;                // 미등록 콜라보 자동 인식
  for (const r of CAT_RULES) if (r.kw.test(name)) return r;
  return CAT_RULES[CAT_RULES.length - 1];
}

function extName(url) {
  const m = url.match(/\.(jpg|jpeg|png|gif|webp)(?:$|\?)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function downloadImage(url, destRel) {
  const abs = path.join(ROOT, destRel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const full = url.startsWith('//') ? 'https:' + url : url;
  const r = await fetch(full, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('이미지 HTTP ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  // 동일 내용이면 다시 쓰지 않음(불필요한 커밋 방지)
  if (fs.existsSync(abs) && fs.readFileSync(abs).equals(buf)) return false;
  fs.writeFileSync(abs, buf);
  return true;
}

// 기존 products.js 에서 SHOP 메타(제목·소개·히어로·공지)만 읽어 보존
function readExistingShopMeta() {
  try {
    const code = fs.readFileSync(PRODUCTS_JS, 'utf8');
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
    return ctx.window.SHOP || null;
  } catch (e) { return null; }
}

function pretty(v) { return JSON.stringify(v, null, 2); }

function genProductsJs(shop, cats, products) {
  return `// ============================================================
//  EASTAR SHOP — 판매상품 데이터
//  ⚙️ 이 파일의 PRODUCTS·SHOP_CATEGORIES 는 scripts/sync-shop.js 가
//     자사몰(eastarjetshop.com)에서 자동 동기화합니다. 직접 수정하지 마세요.
//     (SHOP 제목·히어로·공지 문구는 관리콘솔 shop-admin.html 에서 편집 → 보존됨)
//  여행상품(호텔·액티비티·골프)은 제외됩니다.
// ============================================================

const SHOP = ${pretty(shop)};

const SHOP_CATEGORIES = ${pretty(cats)};

const PRODUCTS = ${pretty(products)};

window.SHOP = SHOP;
window.SHOP_CATEGORIES = SHOP_CATEGORIES;
window.PRODUCTS = PRODUCTS;
`;
}

(async function main() {
  console.log('▶ 자사몰 카테고리 수집…');
  const sitemap = await getText(`${BASE}/sitemap.xml`);
  const catUrls = [...sitemap.matchAll(/https:\/\/[^<]+\/category\/[^<]+/g)].map(m => m[0]);
  const allUrl = catUrls.find(u => /\/category\/(all\/)?42\//.test(u)) || `${BASE}/category/all/${ALL_CAT}/`;
  const travelUrls = catUrls.filter(u => { const id = (u.match(/\/(\d+)\/?$/) || [])[1]; return TRAVEL_CATS.has(id); });
  console.log(`  ALL: ${allUrl}`);
  console.log(`  여행(제외) 카테고리: ${travelUrls.length}개`);

  // 여행 상품 ID 수집(제외 집합)
  const exclude = new Set();
  for (const u of travelUrls) {
    const items = await fetchCategory(u);
    items.forEach(it => exclude.add(it.id));
  }
  console.log(`  여행상품 ${exclude.size}종 제외 대상`);

  // 전체 상품 수집 → 여행 제외 = 굿즈
  const all = await fetchCategory(allUrl);
  const goods = all.filter(it => !exclude.has(it.id) && it.name);
  console.log(`▶ 굿즈 ${goods.length}종 추출 (전체 ${all.length})`);

  // 카테고리 집계 + 상품 변환 + 이미지 다운로드
  const usedCats = new Map();
  const products = [];
  let imgChanged = 0;
  for (const it of goods) {
    const cat = categorize(it.name);
    usedCats.set(cat.id, { name: cat.name, parent: cat.parent || null });
    const pid = `es-${it.id}`;
    let imageRel = '';
    if (it.img) {
      try {
        imageRel = `shop/${pid}/img.${extName(it.img)}`;
        if (await downloadImage(it.img, imageRel)) imgChanged++;
      } catch (e) { console.warn(`  ⚠ 이미지 실패 ${pid}: ${e.message}`); imageRel = ''; }
    }
    const price = Number(it.custom || it.price || 0);
    const sale = Number(it.price || 0);
    const p = { id: pid, name: it.name };
    if (cat) p.category = cat.id;
    p.price = price;
    if (sale && sale < price) p.salePrice = sale;
    if (imageRel) p.image = imageRel;
    if (it.alt && it.alt !== it.name) p.desc = it.alt;
    p.buyUrl = it.href.startsWith('http') ? it.href : BASE + it.href;
    p.badge = '';
    p.soldOut = !!it.soldOut;
    p.published = true;
    products.push(p);
  }

  // 카테고리 트리: 상위(model→living→goods) 다음에 각 상위의 하위(콜라보)를 붙인다.
  // 하위 순서: 등록 콜라보(피너츠→미스터두낫띵→BAMKEL) 우선, 그 외(자동 인식)는 이름순.
  const collabOrder = COLLAB_RULES.map(c => c.id);
  const isUsedTop = id => usedCats.has(id) || [...usedCats.values()].some(v => v.parent === id);
  const cats = [];
  for (const r of CAT_RULES) {
    if (!isUsedTop(r.id)) continue;
    cats.push({ id: r.id, name: (usedCats.get(r.id) || {}).name || r.name });
    const kids = [...usedCats.entries()].filter(([, v]) => v.parent === r.id);
    kids.sort((a, b) => {
      const ia = collabOrder.indexOf(a[0]), ib = collabOrder.indexOf(b[0]);
      if (ia < 0 && ib < 0) return a[1].name.localeCompare(b[1].name, 'ko');
      if (ia < 0) return 1; if (ib < 0) return -1; return ia - ib;
    });
    for (const [id, v] of kids) cats.push({ id, name: v.name, parent: r.id });
  }

  // 상품 노출 순서 = 카테고리(브랜드) 순서. 같은 카테고리 안에서는 자사몰 순서 유지(안정 정렬).
  const catIndex = new Map(cats.map((c, i) => [c.id, i]));
  products.sort((a, b) => (catIndex.has(a.category) ? catIndex.get(a.category) : 999)
                        - (catIndex.has(b.category) ? catIndex.get(b.category) : 999));

  // SHOP 메타 보존(없으면 기본값)
  const meta = readExistingShopMeta() || {
    title: 'Eastar SHOP', subtitle: '이스타항공 공식 상품을 만나보세요.',
    hero: { kicker: 'EASTAR SHOP', headline: '이스타항공 공식 굿즈', sub: '하늘 위의 설렘을 일상에서도.', images: [], image: '', link: '' },
    notice: { enabled: false, text: '', link: '', until: '' }
  };

  const out = genProductsJs(meta, cats, products);
  fs.writeFileSync(PRODUCTS_JS, out, 'utf8');
  console.log(`✅ products.js 갱신 — 굿즈 ${products.length}종 / 카테고리 ${cats.length}개 / 이미지 변경 ${imgChanged}건`);
  console.log('   카테고리:', cats.map(c => c.name).join(', '));
})().catch(e => { console.error('❌ 동기화 실패:', e.message); process.exit(1); });
