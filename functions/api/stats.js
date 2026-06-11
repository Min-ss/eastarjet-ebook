// ============================================================
//  Cloudflare Pages Function — 관리자용 방문 통계 API
//  경로: /api/stats?group=day|month|year   (eastarjet-ebook.pages.dev 전용)
//
//  환경변수 (Cloudflare Pages → Settings → Variables and Secrets):
//   - CF_API_TOKEN  : API 토큰 (권한: Account Analytics → Read) ※ Secret ※ 이것만 설정
//   - CF_ACCOUNT_ID : (선택) 계정 ID — 미설정 시 기본값
//   - CF_SITE_TAG   : (선택) Web Analytics RUM siteTag — 미설정 시 기본값
//
//  ※ 무료 Web Analytics는 1회 조회 최대 ~13주(93일) → 월/년은 90일씩 나눠 조회 후 합산.
// ============================================================

const SITE_TAG_DEFAULT = "9f36fa4601844c2e95f5ecc9d9701285";   // Web Analytics RUM siteTag
const ACCOUNT_DEFAULT = "d6f547fff6ac48829ac38b71bc00afbd";    // Cloudflare 계정 ID
const MAX_CHUNK_DAYS = 90;                                     // 단일 쿼리 최대 범위

function out(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function makeChunks(startMs, endMs) {
  const chunks = [];
  const step = MAX_CHUNK_DAYS * 86400000;
  let s = startMs;
  while (s < endMs) {
    const e = Math.min(s + step, endMs);
    chunks.push([new Date(s).toISOString(), new Date(e).toISOString()]);
    s = e + 1;
  }
  return chunks;
}

async function queryChunk(token, account, siteTag, startISO, endISO) {
  const query = `query($a:String!,$s:String!,$st:Time!,$en:Time!){viewer{accounts(filter:{accountTag:$a}){
    byDate:rumPageloadEventsAdaptiveGroups(limit:1000,filter:{siteTag:$s,datetime_geq:$st,datetime_leq:$en},orderBy:[date_ASC]){count sum{visits} dimensions{date}}
    topPages:rumPageloadEventsAdaptiveGroups(limit:20,filter:{siteTag:$s,datetime_geq:$st,datetime_leq:$en},orderBy:[count_DESC]){count dimensions{requestPath}}
    topCountries:rumPageloadEventsAdaptiveGroups(limit:20,filter:{siteTag:$s,datetime_geq:$st,datetime_leq:$en},orderBy:[count_DESC]){count dimensions{countryName}}
  }}}`;
  const r = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { a: account, s: siteTag, st: startISO, en: endISO } }),
  });
  const d = await r.json();
  if (d.errors && d.errors.length) throw new Error(d.errors.map(e => e.message).join("; "));
  const acc = d && d.data && d.data.viewer && d.data.viewer.accounts && d.data.viewer.accounts[0];
  return acc || { byDate: [], topPages: [], topCountries: [] };
}

export async function onRequestGet({ request, env }) {
  const token = env.CF_API_TOKEN;
  const account = env.CF_ACCOUNT_ID || ACCOUNT_DEFAULT;
  const siteTag = env.CF_SITE_TAG || SITE_TAG_DEFAULT;

  if (!token) {
    return out({ ok: false, error: "missing_env", message: "Cloudflare Pages 환경변수 CF_API_TOKEN(API 토큰)을 설정한 뒤 재배포하세요." });
  }

  const url = new URL(request.url);
  const g = url.searchParams.get("group");
  const group = (g === "month" || g === "year") ? g : "day";
  let days = group === "day" ? 30 : 180;      // 일별=30일, 월/년=약 6개월(보존 한도)
  const dParam = parseInt(url.searchParams.get("days"), 10);   // 내려받기 등에서 범위 지정
  if (!isNaN(dParam) && dParam > 0) days = Math.min(dParam, 186);

  const end = new Date();
  const start = new Date(end.getTime() - days * 86400000);
  const chunks = makeChunks(start.getTime(), end.getTime());

  let parts;
  try {
    parts = await Promise.all(chunks.map(c => queryChunk(token, account, siteTag, c[0], c[1])));
  } catch (e) {
    return out({ ok: false, error: "graphql_error", message: String((e && e.message) || e) });
  }

  // 일별 데이터 + 인기페이지/국가 병합
  const dayMap = new Map(), pageMap = new Map(), countryMap = new Map();
  let totalViews = 0, totalVisits = 0;
  for (const p of parts) {
    for (const d of p.byDate || []) {
      const date = d.dimensions.date, v = d.count, vi = (d.sum && d.sum.visits) || 0;
      const cur = dayMap.get(date) || { views: 0, visits: 0 };
      cur.views += v; cur.visits += vi; dayMap.set(date, cur);
      totalViews += v; totalVisits += vi;
    }
    for (const x of p.topPages || []) { const k = x.dimensions.requestPath || "/"; pageMap.set(k, (pageMap.get(k) || 0) + x.count); }
    for (const x of p.topCountries || []) { const k = x.dimensions.countryName || "-"; countryMap.set(k, (countryMap.get(k) || 0) + x.count); }
  }

  // 보기 단위(일/월/년)로 버킷팅
  const bucketMap = new Map();
  for (const [date, val] of [...dayMap.entries()].sort()) {
    const key = group === "year" ? date.slice(0, 4) : group === "month" ? date.slice(0, 7) : date;
    const b = bucketMap.get(key) || { label: key, views: 0, visits: 0 };
    b.views += val.views; b.visits += val.visits; bucketMap.set(key, b);
  }
  const buckets = [...bucketMap.values()].sort((a, b) => (a.label < b.label ? -1 : 1));
  const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  return out({
    ok: true,
    group,
    range: { start: start.toISOString(), end: end.toISOString(), days },
    totals: { views: totalViews, visits: totalVisits },
    buckets,
    topPages: top(pageMap).map(([path, views]) => ({ path, views })),
    topCountries: top(countryMap).map(([country, views]) => ({ country, views })),
  });
}
