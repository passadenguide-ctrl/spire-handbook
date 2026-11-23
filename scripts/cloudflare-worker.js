/**
 * Cloudflare Worker: Spire Notebook & Gemini Bypass Proxy
 * 
 * Бесплатное облачное зеркало без необходимости держать включенным свой компьютер.
 * Развертывание:
 * 1. Зайдите на dash.cloudflare.com -> Workers & Pages -> Create Worker.
 * 2. Вставьте этот код и нажмите Deploy.
 * 3. Скопируйте полученный адрес (например: https://spire-proxy.yourname.workers.dev)
 *    и вставьте его в настройки сайта!
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    // Health check
    if (url.pathname === '/health' || url.pathname === '/ping') {
      return new Response(JSON.stringify({ status: 'active', service: 'Spire Cloudflare Worker' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Target Google Notebook or Gemini API
    let targetUrl;
    if (url.pathname.startsWith('/v1beta/')) {
      targetUrl = new URL(`https://generativelanguage.googleapis.com${url.pathname}${url.search}`);
    } else {
      targetUrl = new URL(`https://notebook.google.com${url.pathname}${url.search}`);
    }

    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set('Host', targetUrl.hostname);
    modifiedHeaders.set('Origin', `https://${targetUrl.hostname}`);
    modifiedHeaders.set('Referer', `https://${targetUrl.hostname}/`);
    modifiedHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    modifiedHeaders.delete('cf-connecting-ip');
    modifiedHeaders.delete('x-forwarded-for');

    try {
      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: modifiedHeaders,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        redirect: 'manual'
      });

      let location = response.headers.get('location');
      if (location && location.includes('location=unsupported')) {
        location = '/notebook/e0e46aa9-a9c6-41a7-b00b-963b83060edb';
      }

      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Credentials', 'true');
      responseHeaders.delete('x-frame-options');
      responseHeaders.delete('content-security-policy');
      responseHeaders.delete('content-security-policy-report-only');

      if (location) {
        responseHeaders.set('location', location);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  },
};
