# Mirmaton API

API Node.js/Express pour l'authentification, la gestion des utilisateurs, des recettes et des catégories pour l'application Mirmaton.

## Fonctionnalités principales

- Authentification JWT (inscription, connexion)
- Gestion des utilisateurs (CRUD, recettes sauvegardées, recettes créées)
- Gestion des recettes (CRUD, association à un chef)
- Gestion des catégories (CRUD)
- Import automatique de recettes et catégories depuis TheMealDB
- Validation des mots de passe robustes
- Architecture modulaire avec Mongoose/MongoDB

## Structure du projet

```
projet-final-back-youssoufmiyad/
│
├── .env
├── package.json
├── README.md
├── src/
│   ├── index.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
└── .gitignore
```

## Installation

1. **Cloner le dépôt**  
    ```bash
    git clone <repo-url>
    cd projet-final-back-youssoufmiyad
    ```

2. **Installer les dépendances**  
    ```bash
    npm install
    ```

3. **Configurer les variables d'environnement**  
    Créez un fichier `.env` à la racine avec par exemple :
    ```env
    DATABASE_URL=mongodb://localhost:27017/Mirmaton
    JWT_SECRET=VotreSecretJWT
    API_URL=http://localhost:3000
    PORT=3000
    ```

4. **Lancer le serveur**  
    ```bash
    npm run dev
    ```

## Endpoints principaux

- `POST   /api/auth/signup` — Inscription
- `POST   /api/auth/login` — Connexion
- `GET    /api/users` — Liste des utilisateurs
- `GET    /api/recipes` — Liste des recettes (pagination, filtres)
- `GET    /api/categories` — Liste des catégories
- `POST   /api/recipes` — Ajouter une recette
- `POST   /api/categories` — Ajouter une catégorie
- ...et bien d'autres (voir les fichiers dans `src/routes/`)

## Import automatique de données

Pour importer les recettes et catégories depuis TheMealDB, exécutez :
```bash
node src/utils/importApi.js
```

## Technologies utilisées

- Node.js / Express
- MongoDB / Mongoose
- JWT
- bcrypt
- dotenv
