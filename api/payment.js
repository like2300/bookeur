const https = require('https');

// Utilise la variable d'environnement, sinon une chaîne vide (évitez de laisser la clé en dur en prod)
const OPENPAY_API_KEY = process.env.OPENPAY_API_KEY || '';

module.exports = (req, res) => {
  // --- CONFIGURATION CORS ---
  // Permet à votre frontend d'appeler cette fonction sans blocage navigateur
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, XO-API-KEY');

  // Gérer la requête de pré-vérification (Preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Accepter uniquement le POST pour les paiements
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }));
    return;
  }

  let body = '';

  // Lecture du corps de la requête envoyée par votre HTML
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // Vérification sommaire du JSON
    try {
      if (!body) throw new Error("Corps de requête vide");
      JSON.parse(body);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'JSON invalide', message: e.message }));
      return;
    }

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

      proxyRes.on('data', chunk => {
        proxyBody += chunk.toString();
      });

      proxyRes.on('end', () => {
        // On renvoie exactement ce que OpenPay nous répond
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(proxyBody);
      });
    });

    proxyReq.on('error', (error) => {
      console.error('❌ Erreur Proxy:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur de connexion à OpenPay', details: error.message }));
    });

    proxyReq.write(body);
    proxyReq.end();
  });
};
