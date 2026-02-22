const http = require('http');
const fs = require('fs');
const path = require('path');

const OPENPAY_API_KEY = 'sk_88c2ed0aedaec198b1f258aab3ad436afcb8997b86f080477a3f6edeefc9f875';

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, XO-API-KEY');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Log all requests
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Proxy to OpenPay API - Payment
  if (req.url === '/api/payment' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('📦 Request body:', body);

      const options = {
        hostname: 'api.openpay-cg.com',
        port: 443,
        path: '/v1/transaction/payment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'XO-API-KEY': OPENPAY_API_KEY,
          'Content-Length': Buffer.byteLength(body)
        }
      };

      console.log('🔗 Sending to OpenPay API...');

      const proxyReq = require('https').request(options, (proxyRes) => {
        let proxyBody = '';

        proxyRes.on('data', chunk => {
          proxyBody += chunk.toString();
        });

        proxyRes.on('end', () => {
          console.log('✅ OpenPay Response Status:', proxyRes.statusCode);
          console.log('📥 OpenPay Response:', proxyBody);

          res.writeHead(proxyRes.statusCode, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(proxyBody);
        });
      });

      proxyReq.on('error', (error) => {
        console.error('❌ Proxy error:', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ error: 'Proxy error', message: error.message }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });

    return;
  }

  // Proxy to OpenPay API - Check Transaction Status
  if (req.url.startsWith('/api/status/') && req.method === 'GET') {
    const referenceId = req.url.replace('/api/status/', '');
    console.log('🔍 Checking status for:', referenceId);

    const options = {
      hostname: 'api.openpay-cg.com',
      port: 443,
      path: `/v1/transaction/status/${referenceId}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'XO-API-KEY': OPENPAY_API_KEY,
        'Content-Length': 0
      }
    };

    const proxyReq = require('https').request(options, (proxyRes) => {
      let proxyBody = '';

      proxyRes.on('data', chunk => {
        proxyBody += chunk.toString();
      });

      proxyRes.on('end', () => {
        console.log('✅ Status Response:', proxyRes.statusCode);
        console.log('📥 Status:', proxyBody);

        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(proxyBody);
      });
    });

    proxyReq.on('error', (error) => {
      console.error('❌ Status check error:', error);
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ error: 'Error', message: error.message }));
    });

    proxyReq.end();
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;

  // Remove query string if present
  filePath = filePath.split('?')[0];
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('⚠️ File not found:', filePath);
        res.writeHead(404);
        res.end('File not found');
      } else {
        console.error('❌ Server error:', err);
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVER BOOKER - E-COMMERCE');
  console.log('='.repeat(50));
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`💳 OpenPay payment: POST http://localhost:${PORT}/api/payment`);
  console.log(`🔍 Check status:  GET  http://localhost:${PORT}/api/status/:referenceId`);
  console.log(`🔑 API Key configured: ${OPENPAY_API_KEY.substring(0, 8)}...`);
  console.log('='.repeat(50));
  console.log('\n📝 Waiting for requests...\n');
});
