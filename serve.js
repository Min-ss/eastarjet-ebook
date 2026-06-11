// ============================================================
//  EASTAR e-Book — 로컬 미리보기 서버
//  「미리보기.bat」을 더블클릭하면 이 서버가 실행됩니다.
//  (PDF 웹진은 file:// 직접열기로는 보안상 표시되지 않아 간이 서버가 필요합니다)
// ============================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(fp, (e, d) => {
    if (e) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('찾을 수 없음: ' + p); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log('────────────────────────────────────────');
  console.log('  이스타항공 e-Book 미리보기 서버 실행 중');
  console.log('  주소: ' + url);
  console.log('  종료: 이 창을 닫으면 서버가 멈춥니다.');
  console.log('────────────────────────────────────────');
  try { exec(`start "" "${url}"`); } catch (e) {}
}).on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.log(`포트 ${PORT}가 이미 사용 중입니다. 열려있는 미리보기 창을 확인하세요.`);
  else console.log('서버 오류: ' + e.message);
});
