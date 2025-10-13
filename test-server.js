const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Temple MVP - Test Server</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏛️ Temple MVP - Test Server</h1>
            <p>✅ Server is running successfully!</p>
            <p>🌐 If you can see this page, external access is working!</p>
            <p>📍 Your IP: ${req.socket.remoteAddress}</p>
            <p>⏰ Time: ${new Date().toLocaleString()}</p>
            <hr>
            <p><strong>Next Step:</strong> Configure Next.js app to run on this port</p>
        </div>
    </body>
    </html>
  `);
});

const PORT = 80;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Access via: http://106.51.129.224:${PORT}`);
});