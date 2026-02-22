# 🚀 Booker - Paiement OpenPay Congo

Application de paiement mobile money (MTN) intégrée avec OpenPay Congo.

## 📦 Installation locale

```bash
# Installer les dépendances (aucune pour ce projet)
npm install

# Lancer le serveur local
npm start
```

L'application est accessible sur : http://localhost:3000

## 🌐 Déploiement sur Vercel

### Option 1 : Via le CLI Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Option 2 : Via GitHub

1. **Push ton code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - OpenPay integration"
   git branch -M main
   git remote add origin https://github.com/TON_USERNAME/booker.git
   git push -u origin main
   ```

2. **Importer sur Vercel**
   - Va sur https://vercel.com
   - Clique sur "New Project"
   - Importe ton repository GitHub
   - Vercel détectera automatiquement la configuration
   - Clique sur "Deploy"

### Option 3 : Via le Dashboard Vercel

1. Va sur https://vercel.com/new
2. Clique sur "Add New..." → "Project"
3. Importe ton repository Git ou utilise "Deploy" manuel

## 🔑 Configuration des variables d'environnement

### Sur Vercel Dashboard :

1. Va sur ton projet
2. Clique sur "Settings" → "Environment Variables"
3. Ajoute :
   - `OPENPAY_API_KEY` = `sk_88c2ed0aedaec198b1f258aab3ad436afcb8997b86f080477a3f6edeefc9f875`
4. Redéploie le projet

### Ou via CLI :

```bash
vercel env add OPENPAY_API_KEY sk_88c2ed0aedaec198b1f258aab3ad436afcb8997b86f080477a3f6edeefc9f875
vercel --prod
```

## 📁 Structure du projet

```
booker/
├── app.html          # Page de paiement (frontend)
├── index.html        # Page d'accueil
├── server.js         # Serveur Node.js + Proxy API OpenPay
├── products.json     # Données produits (optionnel)
├── vercel.json       # Configuration Vercel
├── package.json      # Dépendances et scripts
└── README.md         # Ce fichier
```

## 💳 API OpenPay Congo

### Endpoints

- **Paiement** : `POST /api/payment`
- **Statut** : `GET /api/status/:referenceId`

### Exemple de requête

```javascript
fetch('/api/payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1000,
    payment_phone_number: '242061234567',
    provider: 'MTN',
    customer: { name: 'Jean Dupont', phone: '242061234567' },
    metadata: { order_id: '12345' }
  })
})
```

## 🎨 Technologies

- **Frontend** : HTML5, TailwindCSS, Alpine.js
- **Backend** : Node.js (http module)
- **Paiement** : OpenPay Congo API
- **Hébergement** : Vercel Serverless

## 📞 Contact

**Elenga Omer Fils**  
Téléphone : 061952417

---

© 2025 - Level 20 Unlocked 🏆
