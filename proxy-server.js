const http = require('http');
const httpProxy = require('http-proxy');

const TARGET_PORT = 3010;
const PROXY_PORT = 3010;
const EXTERNAL_IP = '106.51.129.224';

// Create proxy server
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${TARGET_PORT}`,
  changeOrigin: true,
  ws: true,
  xfwd: true
});

// Create server that binds to all interfaces
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Forwarding to localhost:${TARGET_PORT}`);

  proxy.web(req, res, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: Proxy server error');
  });
});

// Handle WebSocket upgrades
server.on('upgrade', (req, socket, head) => {
  console.log(`${new Date().toISOString()} - WebSocket upgrade for ${req.url}`);

  proxy.ws(req, socket, head, (err) => {
    console.error('WebSocket proxy error:', err);
    socket.destroy();
  });
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res.writeHead && !res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: Proxy server error');
  }
});

// Try to bind to external IP first, fallback to all interfaces
console.log(`🚀 Starting proxy server...`);
console.log(`📡 Target: http://localhost:${TARGET_PORT}`);

server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server running on http://0.0.0.0:${PROXY_PORT}`);
  console.log(`📡 Forwarding to http://localhost:${TARGET_PORT}`);
  console.log(`🌐 External access should work via http://${EXTERNAL_IP}:${PROXY_PORT}`);
  console.log(`⏰ Started at ${new Date().toISOString()}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRNOTAVAIL') {
    console.error(`❌ Cannot bind to ${EXTERNAL_IP}:${PROXY_PORT}`);
    console.error(`💡 This confirms the external IP is not directly available`);
    console.error(`💡 Router port forwarding is required for external access`);
  } else {
    console.error('Server error:', err);
  }
});