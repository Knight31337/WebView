const http = require('http');
const https = require('https');
const config = require('./app.config.json');

const PORT = 3333;
const targetUrl = new URL(config.webUrl);

function proxyRequest(req, res) {
  const target = new URL(req.url === '/' ? targetUrl.pathname : req.url, targetUrl.origin);

  const options = {
    hostname: target.hostname,
    port: 443,
    path: target.pathname + target.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: target.hostname,
      referer: targetUrl.origin,
    },
  };
  delete options.headers['accept-encoding']; // get uncompressed for rewriting

  const proxy = https.request(options, (proxyRes) => {
    // Remove headers that block embedding/loading
    const headers = { ...proxyRes.headers };
    delete headers['x-frame-options'];
    delete headers['content-security-policy'];
    delete headers['content-security-policy-report-only'];

    // Rewrite redirects to stay on localhost
    if (headers.location && headers.location.startsWith('https://' + targetUrl.hostname)) {
      headers.location = headers.location.replace('https://' + targetUrl.hostname, '');
    }

    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxy);
}

const server = http.createServer(proxyRequest);

server.listen(PORT, () => {
  console.log(`Preview running at http://localhost:${PORT}`);
  console.log(`Proxying: ${config.webUrl}`);
});
