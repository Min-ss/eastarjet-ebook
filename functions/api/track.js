// ============================================================
//  Cloudflare Pages Function — 익명 열람 통계 수집 비콘
//  경로: /api/track?ev=open|dl|depth|visit&book=<id>&from=<태그>
//
//  저장소: KV 네임스페이스 (바인딩 이름: EB_STATS)
//  ※ 1회 설정: Cloudflare 대시보드 → Workers & Pages → KV →
//     네임스페이스 생성(예: eastarjet-ebook-stats) →
//     Pages 프로젝트 → Settings → Bindings → KV namespace 추가
//     (Variable name: EB_STATS) → 재배포(Retry deployment)
//
//  개인정보·IP 미저장 — 키별 카운터만 증가합니다.
//  GitHub Pages(github.io)에서도 호출되므로 CORS 를 허용합니다.
// ============================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const done = () => new Response(null, { status: 204, headers: CORS });

// 알려진 간행물 id 목록(books.js에서 로드, 아이솔레이트 수명 동안 캐시).
// 미등록 id 로 오는 무의미한 요청이 KV 키를 무한 증식(일일 쓰기 쿼터 소진)시키는 것을 막는다.
let ALLOWED_IDS = null;
async function loadAllowedIds(env, request) {
  if (ALLOWED_IDS) return ALLOWED_IDS;
  try {
    const res = await env.ASSETS.fetch(new Request(new URL("/books.js", request.url)));
    const text = await res.text();
    const ids = new Set();
    for (const m of text.matchAll(/"id"\s*:\s*"([^"]+)"/g)) ids.add(m[1]);
    if (ids.size) ALLOWED_IDS = ids;   // 비면 캐시하지 않음(다음 요청서 재시도)
    return ids.size ? ids : null;
  } catch (e) {
    return null;   // 목록 로드 실패 시 판단 보류 → 기존 통계 유실 방지 위해 통과
  }
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") return done();
  if (!env.EB_STATS) return done();   // KV 미설정 시 조용히 무시 (사이트 동작에 영향 없음)

  const p = new URL(request.url).searchParams;
  const clean = (s, n) => (s || "").replace(/[^A-Za-z0-9._\-]/g, "").slice(0, n);
  const ev = clean(p.get("ev"), 8);
  const book = clean(p.get("book"), 64);
  const from = clean(p.get("from"), 32);

  // 미등록 book id 는 기록하지 않음(KV 남용 차단). 목록 로드 실패 시에만 통과.
  if (book) {
    const ids = await loadAllowedIds(env, request);
    if (ids && !ids.has(book)) return done();
  }

  const month = new Date().toISOString().slice(0, 7);   // YYYY-MM

  const inc = async (key, by = 1) => {
    const v = parseInt(await env.EB_STATS.get(key), 10) || 0;
    await env.EB_STATS.put(key, String(v + by));
  };

  try {
    if (ev === "open" && book) {
      await inc(`open:${book}`);                 // 누적 열람
      await inc(`openm:${book}:${month}`);       // 월별 열람
      if (from) await inc(`src:${from}:${month}`);
    } else if (ev === "visit") {
      await inc(`visit:${month}`);
      if (from) await inc(`src:${from}:${month}`);
    } else if (ev === "dl" && book) {
      await inc(`dl:${book}`);
    } else if (ev === "depth" && book) {
      const page = parseInt(p.get("page"), 10) || 0;
      const total = parseInt(p.get("total"), 10) || 0;
      if (page > 0 && total > 0) {
        const pct = Math.min(100, Math.round((page / total) * 100));
        await inc(`depthsum:${book}`, pct);      // 도달률(%) 합계
        await inc(`depthn:${book}`);             // 표본 수 → 평균 = sum/n
      }
    }
  } catch (e) { /* 통계 실패가 열람을 방해하지 않도록 무시 */ }

  return done();
}
