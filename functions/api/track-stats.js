// ============================================================
//  Cloudflare Pages Function — 관리자 콘솔용 간행물별 통계 조회
//  경로: /api/track-stats   (KV 바인딩 EB_STATS 필요 — track.js 참고)
//  응답: 간행물별 누적/이번달 열람, 다운로드, 평균 도달률(%),
//        유입경로별 집계, 월별 메인 방문 수
// ============================================================

const CORS = { "Access-Control-Allow-Origin": "*" };
const out = (obj) => new Response(JSON.stringify(obj), {
  headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});

async function listAll(kv, prefix) {
  const names = [];
  let cursor;
  do {
    const r = await kv.list({ prefix, cursor });
    names.push(...r.keys.map(k => k.name));
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor);
  return names;
}

export async function onRequestGet({ env }) {
  if (!env.EB_STATS) {
    return out({
      ok: false, error: "missing_kv",
      message: "Cloudflare 대시보드에서 KV 네임스페이스를 만들고 Pages 프로젝트 Settings → Bindings 에 변수 이름 EB_STATS 로 연결한 뒤 재배포하세요.",
    });
  }
  const kv = env.EB_STATS;
  const month = new Date().toISOString().slice(0, 7);
  const get = async (k) => parseInt(await kv.get(k), 10) || 0;

  // ----- 간행물별 -----
  const ids = new Set();
  (await listAll(kv, "open:")).forEach(k => ids.add(k.slice(5)));
  (await listAll(kv, "dl:")).forEach(k => ids.add(k.slice(3)));
  (await listAll(kv, "depthn:")).forEach(k => ids.add(k.slice(7)));

  const books = await Promise.all([...ids].map(async (id) => {
    const [opens, opensMonth, downloads, dsum, dn] = await Promise.all([
      get(`open:${id}`), get(`openm:${id}:${month}`), get(`dl:${id}`),
      get(`depthsum:${id}`), get(`depthn:${id}`),
    ]);
    return { id, opens, opensMonth, downloads, avgDepth: dn ? Math.round(dsum / dn) : null };
  }));
  books.sort((a, b) => b.opens - a.opens);

  // ----- 유입경로별 (누적 + 이번달) -----
  const srcMap = new Map();
  for (const k of await listAll(kv, "src:")) {
    const parts = k.split(":");               // src:<태그>:<YYYY-MM>
    const tag = parts[1], m = parts[2];
    const v = await get(k);
    const cur = srcMap.get(tag) || { tag, total: 0, thisMonth: 0 };
    cur.total += v;
    if (m === month) cur.thisMonth += v;
    srcMap.set(tag, cur);
  }
  const sources = [...srcMap.values()].sort((a, b) => b.total - a.total);

  // ----- 월별 메인 방문 -----
  const visits = [];
  for (const k of await listAll(kv, "visit:")) {
    visits.push({ month: k.slice(6), count: await get(k) });
  }
  visits.sort((a, b) => (a.month < b.month ? -1 : 1));

  return out({ ok: true, month, books, sources, visits });
}
