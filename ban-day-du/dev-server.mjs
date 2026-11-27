import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8787;
const TARGET_ORIGIN = 'https://hr.alphabooks.vn';

const appHtmlPath = path.join(__dirname, 'src', 'app.html');
const phanMemPath = path.join(__dirname, 'src', 'phan-mem.html');
const alphaThemePath = path.join(__dirname, 'src', 'alpha-theme.css');
const alphaUxPath = path.join(__dirname, 'src', 'alpha-ux.js');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;

  // 0. Phục vụ asset Alpha Books
  if (p === '/alpha-theme.css' && fs.existsSync(alphaThemePath)) {
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
    res.end(fs.readFileSync(alphaThemePath, 'utf8'));
    return;
  }
  if (p === '/alpha-ux.js' && fs.existsSync(alphaUxPath)) {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    res.end(fs.readFileSync(alphaUxPath, 'utf8'));
    return;
  }

  // 1. Phục vụ API: Proxy sang TARGET_ORIGIN (hr.alphabooks.vn)
  if (p.startsWith('/api/') || p === '/api') {
    try {
      const targetUrl = new URL(req.url, TARGET_ORIGIN);
      const headers = {};
      for (const [k, v] of Object.entries(req.headers)) {
        if (!['host', 'origin', 'referer'].includes(k.toLowerCase())) {
          headers[k] = v;
        }
      }
      headers['host'] = targetUrl.host;
      headers['origin'] = targetUrl.origin;
      headers['referer'] = targetUrl.href;

      const fetchOpts = {
        method: req.method,
        headers,
        redirect: 'manual'
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const bodyChunks = [];
        for await (const chunk of req) {
          bodyChunks.push(chunk);
        }
        fetchOpts.body = Buffer.concat(bodyChunks);
      }

      const proxyRes = await fetch(targetUrl.href, fetchOpts);
      const resHeaders = {};
      proxyRes.headers.forEach((val, key) => {
        const k = key.toLowerCase();
        if (k === 'content-encoding' || k === 'content-length' || k === 'transfer-encoding') return;
        if (k === 'set-cookie') {
          val = val.replace(/;\s*Secure/gi, '').replace(/;\s*SameSite=None/gi, '; SameSite=Lax');
        }
        resHeaders[key] = val;
      });

      const resBuffer = await proxyRes.arrayBuffer();
      resHeaders['content-length'] = resBuffer.byteLength;
      res.writeHead(proxyRes.status, resHeaders);
      res.end(Buffer.from(resBuffer));
      return;
    } catch (err) {
      console.error('Proxy API error:', err);
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, loi: 'Lỗi kết nối proxy: ' + err.message }));
      return;
    }
  }

  // 2. Phục vụ trang nhân viên app.html (nạp trực tiếp code vừa sửa)
  if (p === '/' || p === '/nv') {
    let html = fs.readFileSync(appHtmlPath, 'utf8');
    html = html.replace('{{ROUTE}}', 'nv').replace(/{{VER}}/g, '1.0.5');
    html = html.replace('</head>', '<link rel="stylesheet" href="/alpha-theme.css">\n<script src="/alpha-ux.js"></script>\n</head>');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // 3. Phục vụ trang quản lý
  if (p === '/quan-ly' || p === '/ql') {
    let html = fs.readFileSync(appHtmlPath, 'utf8');
    html = html.replace('{{ROUTE}}', 'ql').replace(/{{VER}}/g, '1.0.5');
    html = html.replace('</head>', '<link rel="stylesheet" href="/alpha-theme.css">\n<script src="/alpha-ux.js"></script>\n</head>');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // 4. Phục vụ trang trạm quét QR
  if (p === '/tram') {
    let html = fs.readFileSync(appHtmlPath, 'utf8');
    html = html.replace('{{ROUTE}}', 'tram').replace(/{{VER}}/g, '1.0.5');
    html = html.replace('</head>', '<link rel="stylesheet" href="/alpha-theme.css">\n<script src="/alpha-ux.js"></script>\n</head>');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // 5. Phục vụ phần mềm quản lý nhân sự
  if (p === '/phan-mem' || p === '/quan-tri') {
    if (fs.existsSync(phanMemPath)) {
      let html = fs.readFileSync(phanMemPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }
  }

  // 6. Các asset tĩnh khác: fetch từ target
  try {
    const targetUrl = new URL(req.url, TARGET_ORIGIN);
    const r = await fetch(targetUrl.href);
    res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') || 'application/octet-stream' });
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Không tìm thấy: ' + p);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🚀 Localhost Dev Server đang chạy tại: http://127.0.0.1:${PORT}`);
  console.log(`   - Giao diện nhân viên: http://127.0.0.1:${PORT}/`);
  console.log(`   - Trang quản lý:      http://127.0.0.1:${PORT}/quan-ly`);
  console.log(`   - Trang QR trạm:      http://127.0.0.1:${PORT}/tram`);
  console.log(`   - Dữ liệu API:        Đồng bộ trực tiếp với ${TARGET_ORIGIN}\n`);
});
