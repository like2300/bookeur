const https = require('https');

// Clé API OpenPay depuis les variables d'environnement
const OPENPAY_API_KEY = process.env.OPENPAY_API_KEY || 'sk_88c2ed0aedaec198b1f258aab3ad436afcb8997b86f080477a3f6edeefc9f875';

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

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

    const proxyReq = https.request(options, (proxyRes) => {
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
};
