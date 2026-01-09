# Guide d'Installation Complet - Windows
## Dashboard One Health Sénégal v3.0

---

## 📋 Prérequis à Installer

### 1. Node.js (version 22.x)

**Téléchargement** :
1. Aller sur https://nodejs.org/
2. Télécharger **Node.js 22.x LTS** (version recommandée)
3. Lancer l'installeur `.msi`
4. Suivre l'assistant d'installation (cocher "Automatically install necessary tools")

**Vérification** :
```cmd
node --version
# Devrait afficher : v22.x.x

npm --version
# Devrait afficher : 10.x.x
```

---

### 2. pnpm (Gestionnaire de packages)

**Installation** :
```cmd
npm install -g pnpm
```

**Vérification** :
```cmd
pnpm --version
# Devrait afficher : 9.x.x
```

---

### 3. MySQL (Base de données)

**Option A : MySQL Community Server (Recommandé)**

1. **Télécharger** : https://dev.mysql.com/downloads/mysql/
2. **Installer** : 
   - Choisir "Developer Default"
   - Définir un mot de passe root (ex: `root123`)
   - Port par défaut : 3306
3. **Vérifier** :
   ```cmd
   mysql --version
   ```

**Option B : XAMPP (Plus simple pour débutants)**

1. **Télécharger** : https://www.apachefriends.org/
2. **Installer** XAMPP
3. **Démarrer** MySQL depuis le panneau de contrôle XAMPP

---

### 4. Git (Optionnel mais recommandé)

**Téléchargement** : https://git-scm.com/download/win

---

## 📦 Installation du Dashboard

### Étape 1 : Extraire le projet

1. **Extraire** le fichier `onehealth_dashboard_v3_FINAL.zip`
2. **Placer** le dossier dans un emplacement simple, par exemple :
   ```
   C:\Users\VotreNom\Documents\onehealth_dashboard_v3
   ```

---

### Étape 2 : Ouvrir le terminal

1. **Ouvrir** l'Explorateur Windows
2. **Naviguer** vers le dossier du projet
3. **Cliquer** dans la barre d'adresse et taper `cmd` puis **Entrée**
   
   OU
   
   **Clic droit** dans le dossier → "Ouvrir dans le Terminal" (Windows 11)

---

### Étape 3 : Installer les dépendances

```cmd
pnpm install
```

⏱️ **Durée** : 2-5 minutes selon votre connexion

**Si erreur** : Essayer avec npm :
```cmd
npm install
```

---

## 🗄️ Configuration de la Base de Données

### Étape 1 : Créer la base de données

**Méthode A : Ligne de commande**

```cmd
mysql -u root -p
```

Entrer votre mot de passe root, puis :

```sql
CREATE DATABASE onehealth_senegal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Méthode B : phpMyAdmin (si XAMPP)**

1. Ouvrir http://localhost/phpmyadmin
2. Cliquer sur "Nouvelle base de données"
3. Nom : `onehealth_senegal`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer "Créer"

---

### Étape 2 : Configurer les variables d'environnement

1. **Créer** un fichier `.env` à la racine du projet :

```cmd
copy .env.example .env
```

Si `.env.example` n'existe pas, créer `.env` manuellement avec ce contenu :

```env
# Base de données
DATABASE_URL=mysql://root:root123@localhost:3306/onehealth_senegal

# JWT Secret (générer une clé aléatoire)
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire_123456

# OAuth (laisser vide pour l'instant)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Application
VITE_APP_TITLE=Dashboard One Health Sénégal
VITE_APP_LOGO=/logo.png
```

**⚠️ IMPORTANT** : Remplacer `root123` par votre mot de passe MySQL réel !

---

### Étape 3 : Créer les tables

```cmd
pnpm db:push
```

✅ **Résultat attendu** : "Tables created successfully"

---

### Étape 4 : Importer les données

**Import des données principales** :
```cmd
npx tsx scripts/import-data-fixed.ts
```

✅ **Résultat attendu** :
```
✓ Imported 138 malaria records
✓ Imported 325 tuberculose records
✓ Imported 197 pollution air records
```

**Import des données FVR** :
```cmd
npx tsx scripts/import-from-dump.ts
```

✅ **Résultat attendu** :
```
✓ Imported 7 FVR Humain records
✓ Imported 17 FVR Animal records
✓ Imported 7 Grippe Aviaire records
```

---

## 🚀 Démarrage du Dashboard

### Mode Développement (Recommandé)

**Une seule commande démarre tout** (Frontend + Backend) :

```cmd
pnpm dev
```

✅ **Résultat attendu** :
```
Server running on http://localhost:3000/
```

**Ouvrir** votre navigateur et aller sur : **http://localhost:3000**

---

### Mode Production (Optionnel)

**Build** :
```cmd
pnpm build
```

**Démarrer** :
```cmd
pnpm start
```

---

## 🔍 Vérification de l'Installation

### 1. Vérifier que le serveur fonctionne

Ouvrir http://localhost:3000

✅ **Vous devriez voir** :
- Header rouge bordeaux "Dashboard One Health Sénégal"
- 4 cartes KPI colorées (FVR Humain, FVR Animal, Grippe Aviaire, Taux Létalité)
- Graphiques de Paludisme et Tuberculose
- Carte du Sénégal

---

### 2. Vérifier les données

**Ouvrir la console du navigateur** (F12) et vérifier qu'il n'y a pas d'erreurs.

**Tester l'API** :
```cmd
curl http://localhost:3000/api/trpc/dashboard.kpis
```

OU ouvrir dans le navigateur :
```
http://localhost:3000/api/trpc/dashboard.kpis
```

---

## 🛠️ Commandes Utiles

### Développement

```cmd
# Démarrer le serveur de développement
pnpm dev

# Vérifier les erreurs TypeScript
pnpm check

# Formater le code
pnpm format
```

---

### Base de données

```cmd
# Créer/Mettre à jour les tables
pnpm db:push

# Réimporter les données
npx tsx scripts/import-data-fixed.ts
npx tsx scripts/import-from-dump.ts

# Exporter les données
npx tsx export-database.ts
```

---

### Arrêter le serveur

**Dans le terminal** : Appuyer sur `Ctrl + C`

---

## 🐛 Résolution des Problèmes Courants

### Problème 1 : "pnpm : command not found"

**Solution** :
```cmd
npm install -g pnpm
```

Redémarrer le terminal après installation.

---

### Problème 2 : "Cannot connect to database"

**Vérifications** :
1. MySQL est démarré ?
   - XAMPP : Vérifier dans le panneau de contrôle
   - MySQL Service : Vérifier dans Services Windows
2. Le mot de passe dans `.env` est correct ?
3. La base de données `onehealth_senegal` existe ?

**Tester la connexion** :
```cmd
mysql -u root -p onehealth_senegal
```

---

### Problème 3 : "Port 3000 already in use"

**Solution** : Changer le port dans `server/_core/index.ts` :
```typescript
const PORT = 3001; // Au lieu de 3000
```

OU arrêter l'application qui utilise le port 3000.

---

### Problème 4 : "Module not found"

**Solution** :
```cmd
# Supprimer node_modules et réinstaller
rmdir /s /q node_modules
pnpm install
```

---

### Problème 5 : Les graphiques ne s'affichent pas

**Vérifier** que les données sont importées :
```cmd
npx tsx check-malaria.ts
```

Si vide, réimporter :
```cmd
npx tsx scripts/import-data-fixed.ts
```

---

## 📁 Structure des Dossiers

```
onehealth_dashboard_v3/
│
├── client/                    # FRONTEND
│   ├── src/
│   │   ├── pages/            # Pages du dashboard
│   │   │   └── Home.tsx      # Page principale
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── DashboardFilters.tsx
│   │   │   ├── DashboardTabs.tsx
│   │   │   └── SenegalMap.tsx
│   │   ├── lib/
│   │   │   └── trpc.ts       # Client tRPC
│   │   └── index.css         # Styles globaux
│   └── public/               # Assets statiques
│
├── server/                    # BACKEND
│   ├── routers.ts            # Routes API (tRPC)
│   ├── db.ts                 # Requêtes base de données
│   └── _core/                # Configuration serveur
│       └── index.ts          # Point d'entrée serveur
│
├── drizzle/                   # BASE DE DONNÉES
│   └── schema.ts             # Schéma des tables
│
├── data/                      # DONNÉES SOURCE
│   ├── malaria_indicateurs.csv
│   ├── tuberculose_indicateurs.csv
│   ├── fvr_humain_2025.csv
│   ├── fvr_animal_cas.csv
│   ├── grippe_aviaire.csv
│   └── pollution_air.csv
│
├── scripts/                   # SCRIPTS D'IMPORT
│   ├── import-data-fixed.ts  # Import Paludisme/Tuberculose/Pollution
│   └── import-from-dump.ts   # Import FVR/Grippe Aviaire
│
├── .env                       # CONFIGURATION (À CRÉER)
├── package.json              # Dépendances
├── LIVRAISON_README.md       # Documentation générale
├── API_ENDPOINTS.md          # Documentation API
└── INSTALLATION_WINDOWS.md   # Ce fichier
```

---

## 🎯 Accès au Dashboard

### URL Locale
```
http://localhost:3000
```

### Sections disponibles
1. **Vue d'ensemble** : KPIs + Graphiques + Carte
2. **Santé Humaine** : FVR, Paludisme, Tuberculose
3. **Santé Animale** : FVR Animal, Grippe Aviaire
4. **Environnement** : Pollution PM2.5, Pluviométrie

---

## 📊 Accès à la Base de Données

### Via MySQL Command Line

```cmd
mysql -u root -p onehealth_senegal
```

**Requêtes utiles** :
```sql
-- Voir toutes les tables
SHOW TABLES;

-- Compter les enregistrements
SELECT COUNT(*) FROM malaria;
SELECT COUNT(*) FROM tuberculose;
SELECT COUNT(*) FROM fvr_humain;
SELECT COUNT(*) FROM fvr_animal;

-- Voir les données FVR Humain
SELECT * FROM fvr_humain LIMIT 10;
```

---

### Via phpMyAdmin (si XAMPP)

1. Ouvrir http://localhost/phpmyadmin
2. Sélectionner la base `onehealth_senegal`
3. Explorer les tables

---

## 🔐 Authentification (Désactivée)

Le dashboard est actuellement **sans authentification** comme demandé.

Pour activer l'authentification plus tard :
1. Configurer OAuth dans `.env`
2. Modifier `server/routers.ts` : remplacer `publicProcedure` par `protectedProcedure`

---

## 📞 Support

### En cas de problème

1. **Vérifier** les logs dans le terminal
2. **Consulter** `API_ENDPOINTS.md` pour la documentation API
3. **Vérifier** que MySQL est démarré
4. **Vérifier** que le port 3000 est libre

### Logs utiles

**Voir les logs du serveur** : Ils s'affichent directement dans le terminal où vous avez lancé `pnpm dev`

**Voir les logs du navigateur** : Ouvrir la console (F12) dans le navigateur

---

## ✅ Checklist de Démarrage Rapide

- [ ] Node.js 22.x installé
- [ ] pnpm installé
- [ ] MySQL installé et démarré
- [ ] Projet extrait
- [ ] `pnpm install` exécuté
- [ ] Base de données `onehealth_senegal` créée
- [ ] Fichier `.env` configuré avec le bon mot de passe MySQL
- [ ] `pnpm db:push` exécuté
- [ ] `npx tsx scripts/import-data-fixed.ts` exécuté
- [ ] `npx tsx scripts/import-from-dump.ts` exécuté
- [ ] `pnpm dev` exécuté
- [ ] http://localhost:3000 ouvert dans le navigateur
- [ ] Dashboard s'affiche correctement avec les données

---

## 🎉 Félicitations !

Votre Dashboard One Health Sénégal est maintenant opérationnel !

**Prochaines étapes** :
1. Explorer les différentes sections du dashboard
2. Tester les filtres (région, maladie, période)
3. Consulter `API_ENDPOINTS.md` pour utiliser l'API
4. Personnaliser le dashboard selon vos besoins

---

**Date** : 11 janvier 2025  
**Version** : 3.0 FINAL  
**Support** : Consulter LIVRAISON_README.md pour plus d'informations
