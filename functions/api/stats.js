// ============================================================
//  Cloudflare Pages Function — 관리자용 방문 통계 API
//  경로: /api/stats   (eastarjet-ebook.pages.dev 에서만 동작)
//
//  필요한 환경변수 (Cloudflare Pages → Settings → Environment variables):
//   - CF_API_TOKEN  : API 토큰 (권한: Account Analytics → Read)   ※ Secret 권장
//   - CF_ACCOUNT_ID : Cloudflare 계정 ID
//   - CF_SITE_TAG   : (선택) Web Analytics 사이트 토큰. 미설정 시 아래 기본값 사용
// ============================================================

const SITE_TAG_DEFAULT = "4d85921930d3449da6c2bd152139da4c";

function out(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function onRequestGet({ env }) {
  const token = env.CF_API_TOKEN;
  const account = env.CF_ACCOUNT_ID;
  const siteTag = env.CF_SITE_TAG || SITE_TAG_DEFAULT;

  if (!token || !account) {
    return out({
      ok: false, error: "missing_env",
      message: "Cloudflare Pages 환경변수 CF_API_TOKEN, CF_ACCOUNT_ID 를 설정한 뒤 재배포하세요.",
    });
  }

  const end = new Date();
  const start = new Date(end.getTime() - 30 * 24 * 3600 * 1000);
  const startISO = start.toISOString();
  const endISO = end.toISOString();

  const query = `
    query($account:String!,$siteTag:String!,$start:Time!,$end:Time!){
      viewer{
        accounts(filter:{accountTag:$account}){
          total:rumPageloadEventsAdaptiveGroups(limit:1,filter:{siteTag:$siteTag,datetime_geq:$start,datetime_leq:$end}){
            count sum{visits}
          }
          byDate:rumPageloadEventsAdaptiveGroups(limit:1000,filter:{siteTag:$siteTag,datetime_geq:$start,datetime_leq:$end},orderBy:[date_ASC]){
            count sum{visits} dimensions{date}
          }
          topPages:rumPageloadEventsAdaptiveGroups(limit:10,filter:{siteTag:$siteTag,datetime_geq:$start,datetime_leq:$end},orderBy:[count_DESC]){
            count dimensions{requestPath}
          }
          topCountries:rumPageloadEventsAdaptiveGroups(limit:10,filter:{siteTag:$siteTag,datetime_geq:$start,datetime_leq:$end},orderBy:[count_DESC]){
            count dimensions{countryName}
          }
        }
      }
    }`;

  let resp;
  try {
    resp = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { account, siteTag, start: startISO, end: endISO } }),
    });
  } catch (e) {
    return out({ ok: false, error: "fetch_failed", message: String(e) });
  }

  let data;
  try { data = await resp.json(); }
  catch (e) { return out({ ok: false, error: "bad_response", message: "Cloudflare API 응답 파싱 실패 (HTTP " + resp.status + ")" }); }

  if (data.errors && data.errors.length) {
    return out({ ok: false, error: "graphql_error", message: data.errors.map(e => e.message).join("; ") });
  }
  const acc = data && data.data && data.data.viewer && data.data.viewer.accounts && data.data.viewer.accounts[0];
  if (!acc) {
    return out({ ok: false, error: "no_data", message: "계정/사이트 데이터를 찾지 못했습니다. CF_ACCOUNT_ID 와 사이트 토큰을 확인하세요." });
  }

  const total = (acc.total && acc.total[0]) || { count: 0, sum: { visits: 0 } };
  const byDate = (acc.byDate || []).map(d => ({ date: d.dimensions.date, views: d.count, visits: (d.sum && d.sum.visits) || 0 }));
  const topPages = (acc.topPages || []).map(d => ({ path: d.dimensions.requestPath, views: d.count }));
  const topCountries = (acc.topCountries || []).map(d => ({ country: d.dimensions.countryName, views: d.count }));

  return out({
    ok: true,
    range: { start: startISO, end: endISO, days: 30 },
    totals: { views: total.count, visits: (total.sum && total.sum.visits) || 0 },
    byDate, topPages, topCountries,
  });
}
