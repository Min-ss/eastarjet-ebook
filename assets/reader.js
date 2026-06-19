// ============================================================
//  EASTAR e-Book — 읽기 환경(reader) 공통 로직
//  배경 테마 · 야간 모드 · 글자 크기 · 줄 간격 · 몰입 모드 · 진행률
//  사용법: 뷰어에서  EBReader.init({ features, onFont, onGap, onImmersive })
//          페이지 이동 시  EBReader.setProgress(현재, 전체)
//  설정값은 localStorage 에 저장되어 다음 방문에도 유지됩니다.
// ============================================================
(function () {
  var LS = {
    theme: 'eb_reader_theme', night: 'eb_reader_night',
    font: 'eb_reader_font', gap: 'eb_reader_gap', imm: 'eb_reader_immersive'
  };
  var lget = function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  var lset = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

  // 글자 크기 / 줄 간격 단계
  var FONT = [{ v: 0.9, t: '작게' }, { v: 1.0, t: '보통' }, { v: 1.15, t: '크게' }, { v: 1.3, t: '더 크게' }, { v: 1.5, t: '아주 크게' }];
  var GAP = [{ v: 2, t: '좁게' }, { v: 8, t: '보통' }, { v: 18, t: '넓게' }, { v: 32, t: '아주 넓게' }];

  var THEME_FILTER = {
    light: '',
    sepia: 'sepia(0.45) brightness(0.97) contrast(0.95)',
    dark: 'brightness(0.82) contrast(1.03)'
  };
  var THEME_BG = { light: '', sepia: '#ece0c8', dark: '#101216' };

  var state = {
    theme: lget(LS.theme, 'light'),
    night: lget(LS.night, '') === '1',
    fontIdx: clampIdx(parseInt(lget(LS.font, '1'), 10), FONT),
    gapIdx: clampIdx(parseInt(lget(LS.gap, '1'), 10), GAP),
    immersive: lget(LS.imm, '') === '1'
  };
  var cfg = {};

  function clampIdx(i, arr) { i = isNaN(i) ? 1 : i; return Math.max(0, Math.min(arr.length - 1, i)); }

  // ---------- 적용 ----------
  function applyTheme() {
    if (!THEME_FILTER[state.theme]) state.theme = 'light';
    var f = THEME_FILTER[state.theme] || '';
    if (state.night) f = (f ? f + ' ' : '') + 'sepia(0.35) brightness(0.85)';
    document.body.style.setProperty('--page-filter', f || 'none');
    document.body.style.setProperty('--stage-bg', THEME_BG[state.theme] || '');
    document.body.setAttribute('data-reader-theme', state.theme);
    document.body.classList.toggle('reader-night', state.night);
    syncUI();
  }
  function applyGap() {
    document.body.style.setProperty('--reader-gap', GAP[state.gapIdx].v + 'px');
    if (cfg.onGap) cfg.onGap(GAP[state.gapIdx].v);
  }
  function applyFont() {
    if (cfg.onFont) cfg.onFont(FONT[state.fontIdx].v);
  }
  function applyImmersive() {
    document.body.classList.toggle('reader-immersive', state.immersive);
    syncUI();
    if (cfg.onImmersive) cfg.onImmersive(state.immersive);
  }

  // ---------- 진행률 ----------
  function setProgress(cur, total) {
    if (!total || total < 1) return;
    var pct = Math.max(0, Math.min(100, Math.round((cur / total) * 100)));
    var fill = document.getElementById('ebrProgressFill');
    var em = document.getElementById('ebrProgressPct');
    var bar = document.getElementById('ebrProgress');
    if (fill) fill.style.width = pct + '%';
    if (em) em.textContent = pct + '%';
    if (bar) { bar.classList.add('show-pct'); clearTimeout(bar._t); bar._t = setTimeout(function () { bar.classList.remove('show-pct'); }, 1600); }
  }

  // ---------- UI 동기화 ----------
  function syncUI() {
    var seg = document.getElementById('ebrTheme');
    if (seg) seg.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b.dataset.v === state.theme); });
    setSwitch('ebrNight', state.night);
    setSwitch('ebrImm', state.immersive);
    var fv = document.getElementById('ebrFontVal'); if (fv) fv.textContent = FONT[state.fontIdx].t;
    var gv = document.getElementById('ebrGapVal'); if (gv) gv.textContent = GAP[state.gapIdx].t;
    var fd = document.getElementById('ebrFontDown'), fu = document.getElementById('ebrFontUp');
    if (fd) fd.disabled = state.fontIdx <= 0; if (fu) fu.disabled = state.fontIdx >= FONT.length - 1;
    var gd = document.getElementById('ebrGapDown'), gu = document.getElementById('ebrGapUp');
    if (gd) gd.disabled = state.gapIdx <= 0; if (gu) gu.disabled = state.gapIdx >= GAP.length - 1;
  }
  function setSwitch(id, on) { var el = document.getElementById(id); if (el) el.setAttribute('aria-checked', on ? 'true' : 'false'); }

  // ---------- 패널 열고 닫기 ----------
  function openPanel() { document.getElementById('ebrBackdrop').classList.add('show'); document.getElementById('ebrPanel').classList.add('show'); }
  function closePanel() { document.getElementById('ebrBackdrop').classList.remove('show'); document.getElementById('ebrPanel').classList.remove('show'); }

  // ---------- DOM 주입 ----------
  function build() {
    var feat = cfg.features || {};
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="ebr-progress" id="ebrProgress"><span id="ebrProgressFill"></span><em id="ebrProgressPct"></em></div>' +
      '<button class="ebr-fab" id="ebrFab" title="읽기 설정" aria-label="읽기 설정">⚙</button>' +
      '<div class="ebr-imm-exit" id="ebrImmExit">몰입 모드 · 탭하면 해제</div>' +
      '<div class="ebr-backdrop" id="ebrBackdrop"></div>' +
      '<div class="ebr-panel" id="ebrPanel" role="dialog" aria-label="읽기 설정" aria-modal="true">' +
        '<div class="ebr-grip"></div>' +
        '<div class="ebr-panel-head"><span>읽기 설정</span><button class="ebr-x" id="ebrClose" aria-label="닫기">✕</button></div>' +
        '<div class="ebr-row"><label>배경 테마</label>' +
          '<div class="ebr-seg" id="ebrTheme">' +
            '<button data-v="light">라이트</button><button data-v="sepia">세피아</button><button data-v="dark">다크</button>' +
          '</div></div>' +
        '<div class="ebr-row"><label>야간 모드<small>블루라이트·밝기 ↓</small></label>' +
          '<button class="ebr-switch" id="ebrNight" role="switch" aria-label="야간 모드"></button></div>' +
        '<div class="ebr-row" id="ebrFontRow"' + (feat.font ? '' : ' hidden') + '><label>글자 크기<small>고정 PDF는 기본 배율</small></label>' +
          '<div class="ebr-stepper"><button id="ebrFontDown" aria-label="글자 작게">－</button><span id="ebrFontVal">보통</span><button id="ebrFontUp" aria-label="글자 크게">＋</button></div></div>' +
        '<div class="ebr-row" id="ebrGapRow"' + (feat.gap ? '' : ' hidden') + '><label>줄 간격<small>스크롤(연속) 모드</small></label>' +
          '<div class="ebr-stepper"><button id="ebrGapDown" aria-label="간격 좁게">－</button><span id="ebrGapVal">보통</span><button id="ebrGapUp" aria-label="간격 넓게">＋</button></div></div>' +
        '<div class="ebr-row"><label>몰입 모드<small>읽기 중 UI 최소화</small></label>' +
          '<button class="ebr-switch" id="ebrImm" role="switch" aria-label="몰입 모드"></button></div>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    // 이벤트
    document.getElementById('ebrFab').onclick = openPanel;
    document.getElementById('ebrClose').onclick = closePanel;
    document.getElementById('ebrBackdrop').onclick = closePanel;
    document.getElementById('ebrTheme').querySelectorAll('button').forEach(function (b) {
      b.onclick = function () { state.theme = b.dataset.v; lset(LS.theme, state.theme); applyTheme(); };
    });
    document.getElementById('ebrNight').onclick = function () { state.night = !state.night; lset(LS.night, state.night ? '1' : ''); applyTheme(); };
    document.getElementById('ebrImm').onclick = function () { setImmersive(!state.immersive); };
    document.getElementById('ebrImmExit').onclick = function () { setImmersive(false); };
    var fStep = function (d) { state.fontIdx = clampIdx(state.fontIdx + d, FONT); lset(LS.font, state.fontIdx); applyFont(); syncUI(); };
    var gStep = function (d) { state.gapIdx = clampIdx(state.gapIdx + d, GAP); lset(LS.gap, state.gapIdx); applyGap(); syncUI(); };
    document.getElementById('ebrFontDown').onclick = function () { fStep(-1); };
    document.getElementById('ebrFontUp').onclick = function () { fStep(1); };
    document.getElementById('ebrGapDown').onclick = function () { gStep(-1); };
    document.getElementById('ebrGapUp').onclick = function () { gStep(1); };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
  }

  function setImmersive(on) { state.immersive = !!on; lset(LS.imm, state.immersive ? '1' : ''); applyImmersive(); }

  // ---------- 초기화 ----------
  function init(options) {
    cfg = options || {};
    build();
    applyTheme();
    applyGap();
    applyFont();
    if (state.immersive) applyImmersive(); else syncUI();
  }

  window.EBReader = {
    init: init,
    setProgress: setProgress,
    setImmersive: setImmersive,
    toggleImmersive: function () { setImmersive(!state.immersive); },
    openSettings: openPanel,
    getFont: function () { return FONT[state.fontIdx].v; },
    getGap: function () { return GAP[state.gapIdx].v; },
    isImmersive: function () { return state.immersive; }
  };
})();
