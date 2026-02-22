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
git commit -m "🎉 Initial commit - Booker OpenPay"

# Créer la branche main
git branch -M main

# Ajouter le remote (remplace TON_USERNAME par ton pseudo GitHub)
git remote add origin https://github.com/TON_USERNAME/booker.git

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
```

---

## MÉTHODE 3 : Drag & Drop (Sans Git)

1. **Va sur** https://vercel.com/new
2. **Clique** sur "Add New..." → "Project"
3. **Glisse-dépose** ton dossier `booker` dans la zone indiquée
4. **Ajoute** la variable d'environnement
5. **Déploie** !

---

## ✅ Vérification

Après déploiement :

1. Ouvre l'URL fournie par Vercel
2. Teste un paiement
3. Vérifie les logs dans le dashboard Vercel

---

## 🔧 Commandes utiles

```bash
# Voir les déploiements
vercel ls

# Voir les logs
vercel logs

# Supprimer un déploiement
vercel rm <deployment-url>

# Annuler un déploiement
vercel rollback
```

---

## 🆘 Problèmes courants

### Erreur : "API Key not found"
→ Ajoute la variable `OPENPAY_API_KEY` dans Vercel Dashboard

### Erreur : "CORS"
→ Vérifie que tu utilises `/api/payment` (pas l'URL directe)

### Erreur : "404 Not Found"
→ Vérifie que `vercel.json` est présent

---

## 📞 Support

Besoin d'aide ? Contacte : **Elenga Omer Fils** - 061952417
