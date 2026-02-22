# 🚀 DÉPLOIEMENT RAPIDE SUR VERCEL

## Prérequis
- Compte Vercel (gratuit) : https://vercel.com/signup
- Node.js installé (optionnel, pour le CLI)

---

## MÉTHODE 1 : Via GitHub (Recommandé - Gratuit)

### Étape 1 : Pusher le code sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Ready for Vercel deployment"

# Créer la branche main
git branch -M main

# Ajouter le remote (remplace omerlinks par ton pseudo GitHub)
git remote add origin https://github.com/omerlinks/booker.git

# Pousser le code
git push -u origin main
```

### Étape 2 : Importer sur Vercel

1. **Va sur** https://vercel.com/new
2. **Clique** sur "Import Git Repository"
3. **Sélectionne** ton repository `booker`
4. **Configure** le projet :
   - **Framework Preset** : `Other`
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : (laisser vide)
   - **Output Directory** : (laisser vide)
   - **Install Command** : (laisser vide)

5. **Ajoute les variables d'environnement** :
   - Clique sur "Environment Variables"
   - Ajoute : `OPENPAY_API_KEY` = `sk_88c2ed0aedaec198b1f258aab3ad436afcb8997b86f080477a3f6edeefc9f875`

6. **Clique** sur "Deploy"

### Étape 3 : C'est déployé ! 🎉

Vercel va te donner une URL du type : `https://booker-xxx.vercel.app`

---

## MÉTHODE 2 : Via CLI Vercel (Terminal)

### Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

### Étape 2 : Se connecter

```bash
vercel login
```

### Étape 3 : Déployer

```bash
# Déploiement (première fois)
vercel

# Réponds aux questions :
# - Set up and deploy? Y
# - Which scope? (choisis ton compte)
# - Link to existing project? N
# - Project name? booker
# - Directory? ./
# - Override settings? N

# Déploiement en production
vercel --prod
```

### Étape 4 : Ajouter la variable d'environnement

```bash
vercel env add OPENPAY_API_KEY sk_88c2ed0aedaec198b1f258aab3ad436afcb8997b86f080477a3f6edeefc9f875
vercel --prod
```

---

## MÉTHODE 3 : Drag & Drop (Sans Git)

1. **Va sur** https://vercel.com/new
2. **Clique** sur "Add New..." → "Project"
3. **Glisse-dépose** ton dossier `booker` dans la zone indiquée
4. **Ajoute** la variable d'environnement
5. **Déploie** !

---

## ✅ Vérification après déploiement

1. **Ouvre** l'URL fournie par Vercel (ex: `https://booker-xxx.vercel.app`)
2. **Teste** un paiement avec :
   - Nom : `Test`
   - Numéro : `061234567`
   - Montant : `100`
3. **Vérifie** les logs dans le dashboard Vercel

---

## 🔧 Commandes utiles

```bash
# Voir les déploiements
vercel ls

# Voir les logs
vercel logs <deployment-url>

# Supprimer un déploiement
vercel rm <deployment-url>

# Annuler un déploiement
vercel rollback
```

---

## 🆘 Problèmes courants

### Erreur : "API Key not found"
→ Ajoute la variable `OPENPAY_API_KEY` dans Vercel Dashboard → Settings → Environment Variables

### Erreur : "404 Not Found" sur /api/payment
→ Vérifie que le dossier `api/` existe avec `payment.js` et `status.js`

### Erreur : "CORS"
→ Les fonctions API dans `api/` gèrent déjà le CORS automatiquement

### Site ne charge pas
→ Vérifie que `index.html` existe à la racine du projet

---

## 📁 Structure du projet

```
booker/
├── api/
│   ├── payment.js    # Endpoint /api/payment
│   └── status.js     # Endpoint /api/status/:id
├── index.html        # Page principale
├── server.js         # Serveur local (dev only)
├── vercel.json       # Configuration Vercel
├── package.json      # Métadonnées
└── README.md         # Documentation
```

---

## 📞 Support

Besoin d'aide ? Contacte : **Elenga Omer Fils** - 061952417
