const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Bind to all interfaces
const port = 3010;

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Log external requests
      const clientIP = req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null);

      console.log(`${new Date().toISOString()} - ${req.method} ${pathname} - Client: ${clientIP}`);

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
  .once('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  })
  .listen(port, hostname, () => {
    console.log(`🚀 Custom Next.js server ready!`);
    console.log(`📍 Local: http://localhost:${port}`);
    console.log(`🌐 Network: http://0.0.0.0:${port}`);
    console.log(`🏠 External: http://106.51.129.224:${port}`);
    console.log(`📊 Internal IP: http://192.168.0.175:${port}`);
    console.log(`⏰ Started at ${new Date().toISOString()}`);
    console.log(`\n💡 If external access doesn't work, ensure router port forwarding is configured:`);
    console.log(`   External Port ${port} → Internal IP 192.168.0.175:${port}`);
  });
});