***

# Teru Backend – Web App + Mood

## 1. Prérequis à installer

Sur votre machine :

- **Node.js** (v18+ recommandé)  
  - Télécharger : https://nodejs.org  
- **npm** (installé avec Node.js)  
- **MongoDB Community Server** (base de données locale)[1][2]
  - Télécharger : https://www.mongodb.com/try/download/community  
  - Laisser l’option “Install as a Service” cochée (MongoDB tourne en arrière‑plan).  
- (Optionnel) **MongoDB Compass** pour visualiser la base[3]
  - Télécharger : https://www.mongodb.com/try/download/compass  
- **Visual Studio Code** (ou autre IDE)

***

## 2. Installation du projet

Cloner le repo, puis dans un terminal ouvert à la racine du projet :

```bash
# Installer toutes les dépendances listées dans package.json
npm install
```

Si besoin d’installer manuellement les librairies backend :

```bash
# Serveur HTTP
npm install express

# Connexion MongoDB + modèles
npm install mongoose

# Variables d’environnement (.env)
npm install dotenv

# Hash des mots de passe
npm install bcryptjs

# Tokens JWT
npm install jsonwebtoken

# Appels HTTP vers services externes (bot, etc.)
npm install axios
```

***

## 3. Configuration `.env`

À la racine du projet (même niveau que `app.js`), créer un fichier `.env` :

```env
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/teru_db
JWT_SECRET=change_moi_par_un_super_secret_long
```

Conseil : ajouter `.env` au `.gitignore` pour ne pas le pousser sur le repo.

***

## 4. Lancer le backend

Dans un terminal à la racine du projet :

```bash
node app.js
```

Si MongoDB est bien installé et le service démarré, vous devriez voir :

```text
Connecté à MongoDB
Serveur lancé sur http://localhost:3000
```

Test rapide dans un navigateur ou via REST Client / Postman :

- `GET http://localhost:3000/` → doit renvoyer un texte de confirmation.

***

## 5. API disponible (résumé)

### Authentification

**Inscription**

```http
POST http://localhost:3000/inscription
Content-Type: application/json

{
  "email": "test@test.com",
  "mot_de_passe": "azerty123",
  "nom": "Kevin"
}
```

**Connexion**

```http
POST http://localhost:3000/connexion
Content-Type: application/json

{
  "email": "test@test.com",
  "mot_de_passe": "azerty123"
}
```

→ renvoie un `token` JWT à utiliser dans :

```http
Authorization: Bearer VOTRE_TOKEN_ICI
```

### Messages (protégés par JWT)

```http
POST http://localhost:3000/message
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI

{
  "texte": "Message lié à mon compte"
}
```

→ enregistre le message pour l’utilisateur connecté.

```http
GET http://localhost:3000/messages
```

→ liste actuelle de tous les messages (version simple).

### Mood 2D (Feldman Barrett / Russell)

**Enregistrer un mood utilisateur**

```http
POST http://localhost:3000/mood
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI

{
  "x": 0.7,
  "y": -0.2
}
```

- `x` et `y` sont des coordonnées normalisées entre `-1` et `1` dans un cercle (valence / activation).

**Mood global (moyenne de tous les moods)**

```http
GET http://localhost:3000/mood-global
```

Réponse typique :

```json
{
  "count": 10,
  "global": { "x": 0.1, "y": -0.3 }
}
```

***

## 6. Mini front de test (sélecteur de mood)

Dans le dossier `front/` :

- `index.html` : contient un cercle cliquable et inclut `mood.js`.
- `mood.js` :
  - transforme le clic dans le cercle en coordonnées `(x, y)` dans `[-1, 1]`,
  - déplace un point rouge pour visualiser la position,
  - peut envoyer `{ x, y }` au backend via `fetch` :

```js
const token = 'VOTRE_TOKEN_JWT';

fetch('http://localhost:3000/mood', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ x, y })
});
```

Pour tester :

1. Lancer le backend : `node app.js`.  
2. Appeler `/inscription` puis `/connexion` pour obtenir un token.  
3. Coller ce token dans `front/mood.js`.  
4. Ouvrir `front/index.html` dans un navigateur (double‑clic sur le fichier).  
5. Cliquer dans le cercle pour envoyer des moods.

### 7. Séquence de test rapide (pas à pas)

1. **Cloner et installer**

```bash
git clone <URL_DU_REPO>
cd mon-premier-backend
npm install
```

2. **Vérifier MongoDB en local**, puis créer `.env` :

```env
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/teru_db
JWT_SECRET=change_moi_par_un_super_secret_long
```

3. **Lancer le backend**

```bash
node app.js
```

4. **Dans un outil HTTP (REST Client, Postman, etc.) :**

- Créer un utilisateur :

```http
POST http://localhost:3000/inscription
Content-Type: application/json

{
  "email": "test@test.com",
  "mot_de_passe": "azerty123",
  "nom": "Kevin"
}
```

- Se connecter et récupérer le `token` :

```http
POST http://localhost:3000/connexion
Content-Type: application/json

{
  "email": "test@test.com",
  "mot_de_passe": "azerty123"
}
```

Copier le `token` renvoyé.

- Envoyer un message protégé :

```http
POST http://localhost:3000/message
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI

{
  "texte": "Hello Teru"
}
```

- Enregistrer un mood :

```http
POST http://localhost:3000/mood
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI

{
  "x": 0.7,
  "y": -0.2
}
```

- Vérifier le mood global :

```http
GET http://localhost:3000/mood-global
```
