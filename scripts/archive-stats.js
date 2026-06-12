// ============================================================
//  방문통계 CSV 자동 보관
//  - 무료 Web Analytics 자료는 약 6개월 뒤 사라지므로
//    GitHub Actions 가 매월 1일 이 스크립트로 CSV를 만들어 커밋합니다.
//  - 수동 실행: node scripts/archive-stats.js  (Node 18+)
// ============================================================
const fs = require('fs');
const path = require('path');

const API = 'https://eastarjet-ebook.pages.dev/api/stats?group=day&days=186';

(async () => {
  const r = await fetch(API);
  const d = await r.json();
  if (!d.ok) {
    console.error('통계 API 오류: ' + (d.message || d.error || r.status));
    process.exit(1);
  }

  const cell = v => { v = (v == null ? '' : String(v)); return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const today = new Date().toISOString().slice(0, 10);
  const rows = [];
  rows.push(['이스타항공 e-Book 방문통계 (자동 보관)']);
  rows.push(['생성일', today]);
  rows.push(['집계기간', (d.range && d.range.start || '').slice(0, 10) + ' ~ ' + (d.range && d.range.end || '').slice(0, 10)]);
  rows.push(['총 페이지뷰', d.totals.views, '총 방문', d.totals.visits]);
  rows.push([]);
  rows.push(['[일별]']); rows.push(['날짜', '페이지뷰', '방문']);
  (d.buckets || []).forEach(b => rows.push([b.label, b.views, b.visits]));
  rows.push([]);
  rows.push(['[인기 페이지]']); rows.push(['경로', '페이지뷰']);
  (d.topPages || []).forEach(p => rows.push([p.path, p.views]));
  rows.push([]);
  rows.push(['[국가]']); rows.push(['국가', '페이지뷰']);
  (d.topCountries || []).forEach(c => rows.push([c.country, c.views]));

  const csv = '﻿' + rows.map(r => r.map(cell).join(',')).join('\r\n');   // BOM — 엑셀 한글 깨짐 방지
  const dir = path.join(__dirname, '..', 'stats-archive');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `방문통계_${today.slice(0, 7)}.csv`);
  fs.writeFileSync(file, csv);
  console.log('저장됨: ' + file);
})().catch(e => { console.error('실패: ' + e.message); process.exit(1); });
