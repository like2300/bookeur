const http = require('http');
const https = require('https'); // Importation propre
const fs = require('fs');
const path = require('path');

const OPENPAY_API_KEY = process.env.OPENPAY_API_KEY;

const handler = (req, res) => {
  // Config CORS pour permettre les requêtes depuis le frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, XO-API-KEY');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // --- API PROXY : PAIEMENT ---
  if (pathname === '/api/payment' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
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

      const proxyReq = https.request(options, (proxyRes) => {
        let proxyBody = '';
        proxyRes.on('data', chunk => { proxyBody += chunk; });
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(proxyBody);
        });
      });

      proxyReq.on('error', (err) => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Proxy Error', message: err.message }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  // --- API PROXY : STATUT ---
  if (pathname.startsWith('/api/status/') && req.method === 'GET') {
    const referenceId = pathname.split('/').pop();
    const options = {
      hostname: 'api.openpay-cg.com',
      port: 443,
      path: `/v1/transaction/status/${referenceId}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'XO-API-KEY': OPENPAY_API_KEY
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let proxyBody = '';
      proxyRes.on('data', chunk => { proxyBody += chunk; });
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(proxyBody);
      });
    });

    proxyReq.on('error', (err) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Status Error', message: err.message }));
    });

    proxyReq.end();
    return;
  }

  // --- SERVEUR DE FICHIERS STATIQUES ---
  let relativePath = pathname === '/' ? 'index.html' : pathname;
  // On cherche le fichier par rapport à la racine du projet
  let filePath = path.join(process.cwd(), relativePath);

  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Si le fichier n'existe pas, on tente de renvoyer l'index.html (utile pour React/Ionic)
      fs.readFile(path.join(process.cwd(), 'index.html'), (err2, indexContent) => {
        if (err2) {
          res.writeHead(404);
          res.end("Fichier non trouvé");
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent);
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
};

module.exports = handler;

// Lancement local
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = 3000;
  http.createServer(handler).listen(PORT, () => {
    console.log(`🚀 Serveur en ligne : http://localhost:${PORT}`);
  });
}
