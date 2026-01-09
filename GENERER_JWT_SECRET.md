# Comment Générer une Clé JWT_SECRET Sécurisée

## 🔐 Qu'est-ce que JWT_SECRET ?

Le `JWT_SECRET` est une clé secrète utilisée pour signer et vérifier les tokens d'authentification. Elle doit être :
- **Longue** (au moins 32 caractères)
- **Aléatoire** (impossible à deviner)
- **Unique** (différente pour chaque projet)
- **Confidentielle** (ne jamais la partager ou la commiter dans Git)

---

## Méthode 1 : Avec Node.js (Recommandé) ✅

### Étape 1 : Ouvrir le terminal dans le dossier du projet

```cmd
cd C:\Users\VotreNom\Documents\onehealth_dashboard_v3
```

### Étape 2 : Exécuter cette commande

```cmd
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Résultat (exemple)
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

✅ **Copier** cette clé et la mettre dans votre fichier `.env` :

```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

---

## Méthode 2 : Avec PowerShell

### Ouvrir PowerShell et exécuter :

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Résultat (exemple)
```
Kj8mN2pQ5rT9vX3wZ7aB4cD1eF6gH0iJ8kL2mN5oP9qR3sT7uV1wX4yZ8aB2cD6eF0
```

✅ **Copier** et utiliser dans `.env`

---

## Méthode 3 : Avec un site en ligne (Moins sécurisé)

### Option A : RandomKeygen
1. Aller sur https://randomkeygen.com/
2. Copier une clé de la section **"Fort Knox Passwords"** ou **"CodeIgniter Encryption Keys"**

### Option B : Generate Random
1. Aller sur https://generate-random.org/encryption-key-generator
2. Choisir "256-bit" ou "512-bit"
3. Cliquer "Generate"
4. Copier la clé

⚠️ **Attention** : Cette méthode est moins sécurisée car la clé transite par Internet.

---

## Méthode 4 : Manuellement (Simple mais moins sécurisé)

Créer une chaîne aléatoire d'au moins 32 caractères mélangeant :
- Lettres majuscules : A-Z
- Lettres minuscules : a-z
- Chiffres : 0-9
- Caractères spéciaux : !@#$%^&*

**Exemple** :
```
JWT_SECRET=MyS3cur3K3y!2025@OneHealth#Senegal$Dashboard%2025
```

⚠️ **Attention** : Ne pas utiliser de mots du dictionnaire ou de dates.

---

## 📝 Configuration du fichier .env

### Étape 1 : Créer le fichier .env

Dans le dossier `onehealth_dashboard_v3`, créer un fichier nommé `.env` (avec le point au début).

**Sur Windows** :
- Ouvrir le Bloc-notes
- Coller le contenu ci-dessous
- Enregistrer sous : `.env` (avec les guillemets pour forcer le nom)
- Type : "Tous les fichiers"

### Étape 2 : Contenu du fichier .env

```env
# Base de données MySQL
# Remplacer 'root123' par votre mot de passe MySQL réel
DATABASE_URL=mysql://root:root123@localhost:3306/onehealth_senegal

# JWT Secret - GÉNÉRER UNE NOUVELLE CLÉ AVEC LA MÉTHODE 1 CI-DESSUS
JWT_SECRET=VOTRE_CLE_GENEREE_ICI_64_CARACTERES_MINIMUM

# OAuth Manus (laisser tel quel)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=
OWNER_OPEN_ID=
OWNER_NAME=

# Configuration de l'application
VITE_APP_TITLE=Dashboard One Health Sénégal
VITE_APP_LOGO=/logo.png

# API Forge (laisser vide)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_KEY=

# Analytics (laisser vide)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

### Étape 3 : Remplacer les valeurs

1. **DATABASE_URL** : Remplacer `root123` par votre mot de passe MySQL
2. **JWT_SECRET** : Remplacer par la clé générée avec la Méthode 1

---

## ✅ Vérification

### Tester que le .env est bien lu :

```cmd
node -e "require('dotenv').config(); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Défini ✓' : 'Non défini ✗')"
```

**Résultat attendu** :
```
JWT_SECRET: Défini ✓
```

---

## 🔒 Sécurité - Bonnes Pratiques

### ✅ À FAIRE :
- Générer une clé unique pour chaque environnement (dev, prod)
- Garder le `.env` en local uniquement
- Ne jamais commiter `.env` dans Git
- Utiliser des clés d'au moins 64 caractères
- Changer la clé si elle est compromise

### ❌ À NE PAS FAIRE :
- Utiliser la même clé pour plusieurs projets
- Partager la clé par email ou chat
- Mettre la clé dans le code source
- Utiliser des mots simples comme "secret123"
- Commiter le fichier `.env` dans Git

---

## 📋 Exemple Complet de .env Configuré

```env
# Base de données
DATABASE_URL=mysql://root:MonMotDePasse2025!@localhost:3306/onehealth_senegal

# JWT Secret (généré avec la Méthode 1)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2

# OAuth (laisser tel quel pour l'instant)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=
OWNER_OPEN_ID=
OWNER_NAME=

# Application
VITE_APP_TITLE=Dashboard One Health Sénégal
VITE_APP_LOGO=/logo.png

# API (laisser vide)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_KEY=

# Analytics (laisser vide)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

---

## 🆘 Aide Rapide

### Le serveur ne démarre pas ?

**Erreur** : `JWT_SECRET is not defined`

**Solution** :
1. Vérifier que le fichier `.env` existe à la racine du projet
2. Vérifier que `JWT_SECRET=` est bien défini dans `.env`
3. Redémarrer le serveur après avoir modifié `.env`

### Comment voir si le .env est bien lu ?

```cmd
type .env
```

Devrait afficher le contenu du fichier.

---

## 📞 Besoin d'aide ?

Si vous avez des problèmes :
1. Vérifier que Node.js est installé : `node --version`
2. Vérifier que le fichier `.env` existe : `dir .env`
3. Vérifier le contenu : `type .env`
4. Consulter `INSTALLATION_WINDOWS.md` pour plus d'aide

---

**Date** : 11 janvier 2025  
**Version** : 3.0 FINAL
