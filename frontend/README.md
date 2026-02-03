# Frontend - Service d'Authentification

Frontend React + TypeScript pour le service d'authentification.

## 🚀 Technologies

- **React 19.2** - Framework UI
- **TypeScript** - Typage statique
- **Vite 7.2** - Build tool et dev server
- **React Router DOM 6.21.2** - Navigation
- **Axios 1.6.5** - Client HTTP
- **Context API** - Gestion d'état

## 📁 Structure du projet

```
src/
├── components/
│   └── ProtectedRoute.tsx     # Composant de protection des routes
├── context/
│   └── AuthContext.tsx         # Context d'authentification global
├── pages/
│   ├── Login.tsx               # Page de connexion
│   ├── Register.tsx            # Page d'inscription
│   ├── Home.tsx                # Page d'accueil (protégée)
│   └── Profile.tsx             # Page de profil (protégée)
├── services/
│   ├── api.ts                  # Instance Axios configurée
│   └── auth.service.ts         # Services d'authentification
├── styles/
│   ├── Auth.css                # Styles pour Login/Register
│   ├── Home.css                # Styles pour Home
│   └── Profile.css             # Styles pour Profile
├── types/
│   └── auth.types.ts           # Types TypeScript
├── App.tsx                     # Composant principal avec routing
└── main.tsx                    # Point d'entrée
```

## 🔧 Installation

```bash
npm install
```

## 🌐 Configuration

Le fichier `.env` est déjà configuré :

```env
VITE_API_URL=http://localhost:8080/api
```

## 🏃 Démarrage

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Build production

```bash
npm run build
```

## 🔐 Fonctionnalités

### Authentification

- **Inscription** : Création de compte avec validation
- **Connexion** : Authentification par identifiant/mot de passe
- **JWT** : Gestion automatique des tokens d'authentification
- **Logout** : Déconnexion sécurisée

### Gestion du profil

- **Visualisation** : Affichage des informations utilisateur
- **Modification** : Mise à jour du profil (nom, email, adresse)
- **Changement de mot de passe** : Modification sécurisée avec vérification

### Navigation

- **Routes protégées** : Accès restreint aux pages authentifiées
- **Redirection automatique** : Vers login si non authentifié
- **Persistance** : Maintien de la session avec localStorage

## 🎨 Pages

### `/login` - Connexion
- Formulaire de connexion (identifiant + mot de passe)
- Gestion des erreurs
- Lien vers inscription

### `/register` - Inscription
- Formulaire d'inscription complet
- Validation des champs (email, mot de passe)
- Confirmation du mot de passe

### `/` - Accueil (protégée)
- Dashboard utilisateur
- Affichage des informations du compte
- Navigation vers profil

### `/profile` - Profil (protégée)
- Visualisation des informations
- Mode édition
- Changement de mot de passe
- Mise à jour des données

## 🔒 Sécurité

- **JWT Tokens** : Stockés dans localStorage
- **Intercepteurs Axios** : Ajout automatique du token aux requêtes
- **Protected Routes** : Vérification de l'authentification
- **Auto-logout** : En cas d'erreur 401/403

## 🌐 API Endpoints utilisés

```
POST   /api/auth/register        - Inscription
POST   /api/auth/login           - Connexion
GET    /api/auth/profile/:id     - Récupération du profil
PUT    /api/auth/profile/:id     - Mise à jour du profil
```

## 🔄 Context API

Le `AuthContext` fournit :
- `user` : Utilisateur connecté
- `isAuthenticated` : État d'authentification
- `isLoading` : État de chargement
- `login()` : Fonction de connexion
- `register()` : Fonction d'inscription
- `logout()` : Fonction de déconnexion
- `updateUser()` : Mise à jour du profil

## 🚀 Utilisation

```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <p>Bienvenue {user.username}</p>
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <button onClick={() => login(credentials)}>Connexion</button>
      )}
    </div>
  );
}
```


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
