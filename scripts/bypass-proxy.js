/**
 * Spire: The City Must Fall — Bypass Reverse Proxy for Google Notebook / Gemini
 * 
 * Назначение:
 * 1. Обход ошибки "location=unsupported" (геоблок РФ) при обращении к Google NotebookLM и Gemini.
 * 2. Снятие заголовков X-Frame-Options и Content-Security-Policy для возможности встраивания.
 * 3. Подмена гео-заголовков (X-Forwarded-For, CF-Connecting-IP).
 * 4. Полная поддержка CORS для веб-клиента.
 * 
 * Запуск:
 *   node scripts/bypass-proxy.js
 *   (или npm run proxy)
 * 
 * Порт по умолчанию: 8787
 */

const http = require('http');
const https = require('https');
const url = require('url');
const zlib = require('zlib');

const PORT = process.env.PORT || 8787;
const TARGET_HOST = 'notebook.google.com';
const TARGET_ORIGIN = `https://${TARGET_HOST}`;

// Safe non-blocked IP for spoofing
const SPOOFED_IP = '142.250.190.46'; // Google US IP

const server = http.createServer((req, res) => {
  // CORS Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Range');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', proxy: 'Spire Bypass Proxy', target: TARGET_HOST, port: PORT }));
    return;
  }

  const parsedUrl = url.parse(req.url);
  let targetPath = parsedUrl.path;

  // If request is directed to /proxy?url=...
  if (parsedUrl.pathname.startsWith('/proxy')) {
    const queryUrl = new URLSearchParams(parsedUrl.query).get('url');
    if (queryUrl) {
      try {
        const u = new URL(queryUrl);
        proxyRequest(u.hostname, u.pathname + u.search, req, res);
        return;
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Некорректный URL для проксирования: ' + e.message);
        return;
      }
    }
  }

  // Default: Proxy to notebook.google.com
  proxyRequest(TARGET_HOST, targetPath, req, res);
});

function proxyRequest(targetHost, targetPath, clientReq, clientRes) {
  const options = {
    hostname: targetHost,
    port: 443,
    path: targetPath,
    method: clientReq.method,
    headers: {
      ...clientReq.headers,
      host: targetHost,
      origin: `https://${targetHost}`,
      referer: `https://${targetHost}/`,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'x-forwarded-for': SPOOFED_IP,
      'client-ip': SPOOFED_IP,
      'cf-connecting-ip': SPOOFED_IP
    }
  };

  // Remove client origin/referer to prevent Google CORS rejects
  delete options.headers['cookie']; // clean cookies for shared anonymous proxying

  const proxyReq = https.request(options, (proxyRes) => {
    // Check for location=unsupported redirect
    let location = proxyRes.headers['location'];
    if (location && location.includes('location=unsupported')) {
      console.log(`[Proxy] Blocked redirect intercepted: ${location} -> Rewriting to notebook main`);
      location = `/notebook/e0e46aa9-a9c6-41a7-b00b-963b83060edb`;
    }

    const modifiedHeaders = { ...proxyRes.headers };

    // Strip iframe blocking headers
    delete modifiedHeaders['x-frame-options'];
    delete modifiedHeaders['content-security-policy'];
    delete modifiedHeaders['content-security-policy-report-only'];

    // Inject CORS headers
    modifiedHeaders['access-control-allow-origin'] = '*';
    modifiedHeaders['access-control-allow-credentials'] = 'true';

    if (location) {
      modifiedHeaders['location'] = location;
    }

    clientRes.writeHead(proxyRes.statusCode, modifiedHeaders);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on('error', (err) => {
    console.error('[Proxy Error]:', err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
      clientRes.end(`Ошибка связи прокси со Шпилем: ${err.message}`);
    }
  });

  clientReq.pipe(proxyReq);
}

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🗡️  Архивариус Шпиля: Скрипт обхода блокировок запущен!`);
  console.log(`   Адрес прокси: http://localhost:${PORT}`);
  console.log(`   Зеркало Блокнота: http://localhost:${PORT}/notebook/e0e46aa9-a9c6-41a7-b00b-963b83060edb`);
  console.log(`   Проверка статуса: http://localhost:${PORT}/health`);
  console.log(`======================================================\n`);
});
