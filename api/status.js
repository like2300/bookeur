const https = require('https');

// Clé API OpenPay depuis les variables d'environnement
const OPENPAY_API_KEY = process.env.OPENPAY_API_KEY || 'sk_88c2ed0aedaec198b1f258aab3ad436afcb8997b86f080477a3f6edeefc9f875';

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only accept GET
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Extract reference ID from URL
  const urlParts = req.url.split('/');
  const referenceId = urlParts[urlParts.length - 1];

  if (!referenceId) {
    res.writeHead(400, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ error: 'Reference ID required' }));
    return;
  }

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

  const proxyReq = https.request(options, (proxyRes) => {
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
};
