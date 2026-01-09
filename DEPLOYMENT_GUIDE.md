# Guide de Déploiement Frontend sur Netlify

## 📋 Prérequis

- Compte Netlify (https://netlify.com)
- Compte GitHub avec le code du frontend
- Backend déployé sur Render (https://one-backend-6.onrender.com)
- Node.js 22.x et pnpm installés localement

---

## 🚀 Étapes de Déploiement

### 1. Préparation du Code Local

```bash
# Cloner le repository (si nécessaire)
git clone <votre-repo>
cd frontend

# Installer les dépendances
pnpm install

# Vérifier que le build fonctionne localement
pnpm build

# Vérifier que le code compile sans erreurs
pnpm check
```

### 2. Configuration des Variables d'Environnement

#### Option A: Via Netlify UI (Recommandé)

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site
3. Allez dans **Site settings** → **Build & deploy** → **Environment**
4. Cliquez sur **Edit variables**
5. Ajoutez les variables suivantes:

| Variable | Valeur |
|----------|--------|
| `VITE_API_BASE_URL` | `https://one-backend-6.onrender.com` |
| `VITE_APP_TITLE` | `OneHealth Dashboard Sénégal` |
| `VITE_APP_LOGO` | `https://placehold.co/128x128/E1E7EF/1F2937?text=OneHealth` |
| `VITE_ENV` | `production` |

#### Option B: Via Fichier .env

Créez un fichier `.env.production` à la racine du projet:

```bash
VITE_API_BASE_URL=https://one-backend-6.onrender.com
VITE_APP_TITLE=OneHealth Dashboard Sénégal
VITE_APP_LOGO=https://placehold.co/128x128/E1E7EF/1F2937?text=OneHealth
VITE_ENV=production
```

### 3. Connexion du Repository à Netlify

#### Option A: Déploiement Continu (Recommandé)

1. Allez sur https://app.netlify.com
2. Cliquez sur **Add new site** → **Import an existing project**
3. Sélectionnez votre provider Git (GitHub, GitLab, Bitbucket)
4. Autorisez Netlify à accéder à votre compte
5. Sélectionnez le repository `frontend`
6. Configurez les paramètres de build:
   - **Base directory**: `.` (racine du projet)
   - **Build command**: `pnpm install && pnpm build`
   - **Publish directory**: `dist/public`
7. Cliquez sur **Deploy site**

#### Option B: Déploiement Manuel

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter à Netlify
netlify login

# Déployer le site
netlify deploy --prod --dir=dist/public
```

### 4. Vérification du Déploiement

Après le déploiement, vérifiez que tout fonctionne:

1. **Accédez au site**: Allez sur l'URL fournie par Netlify
2. **Vérifiez les données**: Le dashboard doit afficher les données du backend
3. **Testez l'assistant**: Cliquez sur le bouton de chat en bas à droite
4. **Vérifiez la console**: Ouvrez les DevTools (F12) et vérifiez qu'il n'y a pas d'erreurs

#### Vérifications à faire:

```javascript
// Dans la console du navigateur (F12):

// 1. Vérifier l'URL de l'API
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

// 2. Faire un test d'appel API
fetch('https://one-backend-6.onrender.com/dashboard/kpis')
  .then(r => r.json())
  .then(d => console.log("API Response:", d))
  .catch(e => console.error("API Error:", e));

// 3. Vérifier les variables d'environnement
console.log("Environment:", {
  apiUrl: import.meta.env.VITE_API_BASE_URL,
  appTitle: import.meta.env.VITE_APP_TITLE,
  env: import.meta.env.VITE_ENV
});
```

---

## 🔧 Configuration Détaillée

### netlify.toml

Le fichier `netlify.toml` à la racine du projet configure:

- **Build**: Commande de build et répertoire de publication
- **Environment**: Variables d'environnement
- **Redirects**: Redirection SPA (Single Page Application)
- **Headers**: En-têtes de sécurité et CORS
- **Cache**: Stratégie de cache pour les assets

### Fichiers de Configuration

- `.env.example`: Template des variables d'environnement
- `.env.production`: Configuration pour la production
- `.env.netlify`: Instructions pour Netlify
- `netlify.toml`: Configuration complète de Netlify

---

## 🐛 Troubleshooting

### Erreur: "Cannot GET /"

**Cause**: Le répertoire de publication n'est pas correct

**Solution**:
1. Vérifiez que `publish = "dist/public"` dans `netlify.toml`
2. Vérifiez que le build génère bien le répertoire `dist/public`
3. Déclenchez un nouveau build

### Erreur: "API Error: 404"

**Cause**: L'URL du backend n'est pas correcte

**Solution**:
1. Vérifiez que `VITE_API_BASE_URL=https://one-backend-6.onrender.com`
2. Vérifiez que le backend Render est en ligne: https://one-backend-6.onrender.com/dashboard/kpis
3. Vérifiez les logs du backend Render

### Erreur: "CORS Error"

**Cause**: Le backend Render n'accepte pas les requêtes de Netlify

**Solution**:
1. Vérifiez que le backend Render a CORS activé
2. Vérifiez que l'URL de Netlify est autorisée dans CORS
3. Contactez l'administrateur du backend

### L'assistant IA ne répond pas

**Cause**: L'endpoint `/assistant/chat` n'existe pas ou n'est pas accessible

**Solution**:
1. Vérifiez que le backend Render a l'endpoint `/assistant/chat`
2. Testez l'endpoint manuellement: `curl -X POST https://one-backend-6.onrender.com/assistant/chat -H "Content-Type: application/json" -d '{"message":"test"}'`
3. Vérifiez les logs du backend Render

### Les données ne s'affichent pas

**Cause**: Les données ne sont pas retournées par le backend

**Solution**:
1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet **Network**
3. Actualisez la page
4. Vérifiez les appels API et leur réponse
5. Vérifiez que le backend retourne les bonnes données

---

## 📊 Monitoring

### Logs Netlify

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site
3. Allez dans **Deploys**
4. Cliquez sur le dernier deploy
5. Allez dans **Deploy log** pour voir les logs de build

### Logs du Navigateur

Ouvrez les DevTools (F12) et allez dans l'onglet **Console** pour voir:
- Les logs d'API
- Les erreurs de connexion
- Les messages de l'assistant

### Monitoring du Backend

Vérifiez les logs du backend Render:
1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service backend
3. Allez dans **Logs**

---

## 🔐 Sécurité

### En-têtes de Sécurité

Le fichier `netlify.toml` configure les en-têtes de sécurité suivants:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### CORS

Les requêtes vers le backend Render doivent être autorisées. Vérifiez que le backend a:

```javascript
// Exemple de configuration CORS sur le backend
app.use(cors({
  origin: ['https://your-netlify-domain.netlify.app', 'https://one-backend-6.onrender.com'],
  credentials: true
}));
```

---

## 📝 Checklist de Déploiement

- [ ] Variables d'environnement configurées dans Netlify
- [ ] Build local réussit (`pnpm build`)
- [ ] Code compilé sans erreurs (`pnpm check`)
- [ ] Repository connecté à Netlify
- [ ] Déploiement déclenché
- [ ] Site accessible sur l'URL Netlify
- [ ] Données affichées correctement
- [ ] Assistant IA fonctionne
- [ ] Pas d'erreurs dans la console
- [ ] Backend Render en ligne et accessible

---

## 🚀 Déploiements Futurs

### Déploiement Continu

Une fois le repository connecté à Netlify, chaque push sur la branche `main` (ou celle configurée) déclenchera automatiquement un nouveau build et un déploiement.

### Déploiement Manuel

Pour forcer un nouveau déploiement:

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site
3. Allez dans **Deploys**
4. Cliquez sur **Trigger deploy** → **Deploy site**

### Rollback

Pour revenir à un déploiement précédent:

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site
3. Allez dans **Deploys**
4. Trouvez le deploy précédent
5. Cliquez sur **...** → **Publish deploy**

---

## 📞 Support

Pour toute question ou problème:

1. Consultez les logs Netlify et du navigateur
2. Vérifiez que le backend Render est en ligne
3. Testez les appels API manuellement
4. Consultez la documentation de Netlify: https://docs.netlify.com

---

## 📚 Ressources

- [Documentation Netlify](https://docs.netlify.com)
- [Guide Vite](https://vitejs.dev)
- [Documentation React](https://react.dev)
- [API Endpoints Documentation](./API_ENDPOINTS.md)

---

**Date de dernière mise à jour**: 2025-01-09
**Version**: 1.0.0
