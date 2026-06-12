// ============================================================
//  익명 열람 통계 비콘 (개인정보·IP 미수집 — 단순 카운트만 전송)
//  수집 이벤트: 메인 방문(visit) · 간행물 열람(open) · PDF 다운로드(dl)
//               · 도달 페이지(depth) · 유입경로(?from= 태그)
//  저장: Cloudflare Pages Function /api/track → KV (EB_STATS)
// ============================================================
(function () {
  var API = 'https://eastarjet-ebook.pages.dev/api/track';

  // 관리자 본인의 접속은 통계에서 제외 (테스트 열람이 집계를 왜곡하지 않도록)
  var isAdmin = false;
  try { isAdmin = localStorage.getItem('eb_admin') === '1'; } catch (e) {}

  // 유입경로 태그(?from=qr 등)는 세션 동안 유지 — 사이트 안에서 이동해도 같은 유입으로 집계
  var from = '';
  try {
    var q = new URLSearchParams(location.search).get('from');
    if (q) { sessionStorage.setItem('eb_from', q); from = q; }
    else from = sessionStorage.getItem('eb_from') || '';
  } catch (e) {}

  function send(params) {
    if (isAdmin) return;
    try {
      var sp = new URLSearchParams(params);
      if (from) sp.set('from', from);
      var u = API + '?' + sp.toString();
      if (navigator.sendBeacon) navigator.sendBeacon(u, '');
      else new Image().src = u;
    } catch (e) {}
  }

  // 같은 세션(탭) 안에서 같은 이벤트 중복 집계 방지
  function once(key) {
    try {
      if (sessionStorage.getItem(key)) return false;
      sessionStorage.setItem(key, '1');
      return true;
    } catch (e) { return true; }
  }

  var depth = null;   // 이번 열람에서 도달한 최대 페이지 — 떠날 때 1회만 전송

  window.ebTrack = {
    visit: function () { if (once('eb_t_visit')) send({ ev: 'visit' }); },
    open: function (bookId) { if (bookId && once('eb_t_open_' + bookId)) send({ ev: 'open', book: bookId }); },
    download: function (bookId) { if (bookId) send({ ev: 'dl', book: bookId }); },
    page: function (bookId, page, total) {
      if (!bookId || !total || !page) return;
      if (!depth || page > depth.page) depth = { book: bookId, page: page, total: total };
    }
  };

  addEventListener('pagehide', function () {
    if (depth) { send({ ev: 'depth', book: depth.book, page: depth.page, total: depth.total }); depth = null; }
  });
})();
