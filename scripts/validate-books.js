// ============================================================
//  books.js ↔ 실제 파일 정합성 검사
//  - GitHub Actions(푸시마다)와 로컬에서 실행: node scripts/validate-books.js
//  - 오류(파일 누락·중복 ID 등)가 있으면 종료코드 1 → 배포 전 차단
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'books.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const BOOKS = sandbox.window.BOOKS || [];
const CATEGORIES = sandbox.window.CATEGORIES || [];
const LOADING_IMAGES = sandbox.window.LOADING_IMAGES || [];
const NOTICE = sandbox.window.NOTICE || {};

const errors = [];
const warns = [];
const exists = p => fs.existsSync(path.join(root, p));
const sizeMB = p => { try { return fs.statSync(path.join(root, p)).size / 1048576; } catch (e) { return 0; } };
const isDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s);

const seen = new Set();
for (const b of BOOKS) {
  if (seen.has(b.id)) errors.push(`중복 폴더 ID: ${b.id}`);
  seen.add(b.id);

  if (!CATEGORIES.some(c => c.id === b.category)) errors.push(`[${b.id}] 존재하지 않는 카테고리: ${b.category}`);
  if (b.cover && !exists(b.cover)) errors.push(`[${b.id}] 표지 파일 없음: ${b.cover}`);
  if (!b.cover) warns.push(`[${b.id}] 표지 미지정`);

  if (b.type === 'pdf') {
    const f = `${b.path}/${b.file || 'doc.pdf'}`;
    if (!exists(f)) errors.push(`[${b.id}] PDF 없음: ${f}`);
    else {
      const mb = sizeMB(f);
      if (mb > 30) errors.push(`[${b.id}] PDF가 너무 큽니다 (${mb.toFixed(1)}MB > 30MB) — 압축 후 다시 올려주세요`);
      else if (mb > 8) warns.push(`[${b.id}] PDF ${mb.toFixed(1)}MB — 모바일에서 로딩이 느릴 수 있습니다 (8MB 이하 권장)`);
    }
  } else {
    if (!(b.pages || []).length) errors.push(`[${b.id}] pages 배열이 비어 있습니다`);
    for (const pg of b.pages || []) {
      if (!exists(`${b.path}/pages/${pg}`)) errors.push(`[${b.id}] 페이지 이미지 없음: ${b.path}/pages/${pg}`);
    }
  }

  if (b.date && !isDate(b.date)) errors.push(`[${b.id}] date 형식 오류 (YYYY-MM-DD): ${b.date}`);
  if (b.publishAt && !isDate(b.publishAt)) errors.push(`[${b.id}] publishAt 형식 오류 (YYYY-MM-DD): ${b.publishAt}`);
}

for (const c of CATEGORIES) {
  if (c.cover && !exists(c.cover)) errors.push(`[카테고리 ${c.id}] 표지 없음: ${c.cover}`);
}
for (const img of LOADING_IMAGES) {
  if (!exists(img)) errors.push(`[로딩 이미지] 파일 없음: ${img}`);
}
if (NOTICE.enabled && !NOTICE.text) warns.push('[공지] enabled 인데 text가 비어 있어 표시되지 않습니다');
if (NOTICE.until && !isDate(NOTICE.until)) errors.push(`[공지] until 형식 오류 (YYYY-MM-DD): ${NOTICE.until}`);

warns.forEach(w => console.log('⚠️  ' + w));
errors.forEach(e => console.log('❌ ' + e));
console.log(`\n검사 완료 — 간행물 ${BOOKS.length}종 · 오류 ${errors.length}건 · 경고 ${warns.length}건`);
process.exit(errors.length ? 1 : 0);
