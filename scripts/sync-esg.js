// ============================================================
//  ESG 지속가능경영 자동 동기화 — main.eastarjet.com/esg 의 안전·환경·사회
//  항목(제목)과 사진을 긁어 esg.js(분류·주제·이미지 매핑)를 재생성하고
//  사진을 assets/esg/ 에 저장합니다.
//  · 사진은 Next.js 이미지 최적화(w=750)로 받아 용량을 줄임
//  · 내용이 같은 사진은 다시 쓰지 않음(불필요한 커밋 방지)
//  · 더 이상 쓰이지 않는 사진은 정리(삭제)
//  · 의존성 없음(Node 18+ 내장 fetch). GitHub Actions(sync-esg.yml)에서 정기 실행.
//  로컬 실행:  node scripts/sync-esg.js
// ============================================================
const fs = require('fs');
const path = require('path');

const PAGE = 'https://main.eastarjet.com/esg';
const OPT = enc => `https://main.eastarjet.com/_next/image?url=${enc}&w=750&q=75`;
const UA = 'Mozilla/5.0 (compatible; EastarEsgSync/1.0; +https://eastarjet-ebook.pages.dev)';
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'assets', 'esg');
const ESG_JS = path.join(ROOT, 'esg.js');

const GROUP = { '안전': '안전경영', '환경': '환경경영', '사회': '사회경영' };

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

function decodeEntities(s) {
  return s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/\s+/g, ' ').trim();
}

// 페이지에서 항목(분류·번호·주제 제목 + 그 항목의 사진들)을 문서 순서대로 추출
function parseItems(html) {
  // 제목 마커(<span>안전</span><span>01</span></span><h5>…</h5>) 기준으로 잘라
  // 각 구간에 들어있는 사진을 그 항목의 사진으로 본다.
  const segs = html.split(/(?=<span>(?:안전|환경|사회)<\/span><span>[0-9]+<\/span><\/span><h5)/);
  const items = [];
  for (const seg of segs) {
    const tm = seg.match(/<span>(안전|환경|사회)<\/span><span>([0-9]+)<\/span><\/span><h5[^>]*>([^<]+)<\/h5>/);
    if (!tm) continue;
    const group = GROUP[tm[1]] || tm[1];
    const topic = decodeEntities(tm[3]);
    const bases = [];
    const seen = new Set();
    for (const im of seg.matchAll(/img_(?:safety|environment|society)_[0-9-]+\.jpg/g)) {
      const b = im[0].replace(/\.jpg$/, '');
      if (!seen.has(b)) { seen.add(b); bases.push(b); }
    }
    if (bases.length) items.push({ group, topic, bases });
  }
  return items;
}

// 사진 basename → 최적화 다운로드용 인코딩된 원본 URL(url= 값)
function parseImageUrls(html) {
  const map = {};
  const re = /url=([^&"']*?(img_(?:safety|environment|society)_[0-9-]+)\.jpg)/g;
  let m;
  while ((m = re.exec(html))) { if (!map[m[2]]) map[m[2]] = m[1]; }
  return map;
}

async function downloadImage(enc, base) {
  const abs = path.join(IMG_DIR, base + '.jpg');
  let buf;
  for (let i = 0; i < 3; i++) {           // 일시적 오류는 재시도로 자동 복구
    try {
      const r = await fetch(OPT(enc), { headers: { 'User-Agent': UA } });
      if (!r.ok) throw new Error('이미지 HTTP ' + r.status);
      buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 1000) throw new Error('이미지 응답이 너무 작음(' + buf.length + 'B)');
      break;
    } catch (e) {
      if (i === 2) throw e;
      await sleep(1000);
    }
  }
  fs.mkdirSync(IMG_DIR, { recursive: true });
  if (fs.existsSync(abs) && fs.readFileSync(abs).equals(buf)) return false;   // 변경 없음
  fs.writeFileSync(abs, buf);
  return true;
}

function genEsgJs(items) {
  return `// ============================================================
//  ESG 지속가능경영 — 표지/주제 데이터 (자동 생성)
//  ⚙️ scripts/sync-esg.js 가 main.eastarjet.com/esg 에서 자동 동기화합니다.
//     직접 수정하지 마세요. (수정해도 다음 동기화 때 덮어써집니다)
// ============================================================
window.ESG_ITEMS = ${JSON.stringify(items, null, 2)};
`;
}

(async function main() {
  console.log('▶ ESG 페이지 수집…', PAGE);
  const html = await getText(PAGE);
  const parsed = parseItems(html);
  const imgUrls = parseImageUrls(html);
  if (parsed.length < 6) throw new Error(`항목이 너무 적게 추출됨(${parsed.length}개) — 페이지 구조 변경 의심. esg.js 보존.`);

  const items = [];
  const used = new Set();
  let changed = 0;
  for (const it of parsed) {
    const images = [];
    for (const base of it.bases) {
      const enc = imgUrls[base];
      if (!enc) { console.warn(`  ⚠ 원본 URL 못 찾음: ${base}`); continue; }
      try {
        if (await downloadImage(enc, base)) changed++;
        images.push('assets/esg/' + base + '.jpg');
        used.add(base + '.jpg');
      } catch (e) { console.warn(`  ⚠ 이미지 실패 ${base}: ${e.message}`); }
    }
    if (images.length) items.push({ group: it.group, topic: it.topic, images });
  }
  if (items.length < 6) throw new Error(`유효 항목이 너무 적음(${items.length}개) — esg.js 보존.`);

  // 더 이상 쓰이지 않는 사진 정리
  let removed = 0;
  if (fs.existsSync(IMG_DIR)) {
    for (const f of fs.readdirSync(IMG_DIR)) {
      if (/\.jpg$/i.test(f) && !used.has(f)) { fs.unlinkSync(path.join(IMG_DIR, f)); removed++; }
    }
  }

  fs.writeFileSync(ESG_JS, genEsgJs(items), 'utf8');
  const total = items.reduce((n, it) => n + it.images.length, 0);
  console.log(`✅ esg.js 갱신 — 항목 ${items.length}개 / 사진 ${total}장 (변경 ${changed} · 삭제 ${removed})`);
  items.forEach(it => console.log(`   · ${it.group} | ${it.topic} (${it.images.length})`));
})().catch(e => { console.error('❌ ESG 동기화 실패:', e.message); process.exit(1); });
