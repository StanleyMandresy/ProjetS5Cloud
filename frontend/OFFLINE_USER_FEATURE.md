# 📱 Fonctionnalité de Création d'Utilisateurs Offline-First

## 🎯 Vue d'ensemble

Cette fonctionnalité permet de créer des utilisateurs même sans connexion Internet. Les utilisateurs sont d'abord enregistrés localement dans le navigateur (IndexedDB), puis automatiquement synchronisés avec Firebase lorsque la connexion est rétablie.

## 🏗️ Architecture

### 1. **IndexedDB (Stockage Local)**
- Base de données locale dans le navigateur
- Persiste même après fermeture du navigateur
- Stocke les utilisateurs en attente de synchronisation

### 2. **Firebase**
- **Firebase Auth** : Authentification des utilisateurs
- **Firestore** : Base de données NoSQL pour stocker les informations utilisateur

### 3. **Synchronisation Automatique**
- Détecte automatiquement le retour de connexion
- Synchronise les utilisateurs en attente
- Gère les erreurs de synchronisation

## 📁 Structure des Fichiers

```
frontend/src/
├── services/
│   ├── localDB.service.ts        # Gestion d'IndexedDB
│   └── userSync.service.ts       # Synchronisation avec Firebase
├── hooks/
│   └── useOnlineStatus.ts        # Hook pour détecter l'état online/offline
├── components/
│   ├── CreateUserOffline.tsx     # Composant de création d'utilisateur
│   └── SyncStatusBadge.tsx       # Badge de statut de synchronisation
├── pages/
│   └── OfflineUserDemo.tsx       # Page de démonstration
└── context/
    └── AuthContext.tsx            # Contexte mis à jour avec synchronisation
```

## 🔧 Fonctionnement Détaillé

### Étape 1 : Création en Local
```typescript
// L'utilisateur remplit le formulaire
const localUser = await localDBService.createLocalUser(
  username, 
  email, 
  password
);
// ✅ Utilisateur créé avec un ID temporaire "local-xxxxx"
```

### Étape 2 : Tentative de Synchronisation
```typescript
if (isOnline) {
  // Si en ligne, synchroniser immédiatement
  await userSyncService.syncUserToFirebase(localUser);
  // ✅ Utilisateur créé dans Firebase Auth + Firestore
} else {
  // ✅ Reste en local, synchronisation différée
}
```

### Étape 3 : Synchronisation Automatique
```typescript
// Quand la connexion revient
window.addEventListener('online', async () => {
  // Récupérer tous les utilisateurs non synchronisés
  const unsyncedUsers = await localDBService.getUnsyncedUsers();
  
  // Synchroniser chacun vers Firebase
  for (const user of unsyncedUsers) {
    await userSyncService.syncUserToFirebase(user);
  }
});
```

## 🚀 Utilisation

### 1. Accéder à la Page de Démonstration
```
http://localhost:5173/offline-demo
```

### 2. Créer un Utilisateur

#### En ligne (comportement normal)
1. Remplir le formulaire
2. Cliquer sur "Créer l'utilisateur"
3. ✅ L'utilisateur est créé dans Firebase immédiatement

#### Hors ligne (mode offline)
1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet **Network**
3. Cocher **Offline** pour simuler une perte de connexion
4. Remplir le formulaire
5. Cliquer sur "Créer l'utilisateur"
6. ✅ L'utilisateur est créé en local
7. Décocher **Offline** pour simuler le retour de connexion
8. ✅ Synchronisation automatique avec Firebase

### 3. Synchronisation Manuelle
Si des utilisateurs sont en attente :
- Un badge s'affiche avec le nombre d'utilisateurs non synchronisés
- Cliquer sur "Synchroniser maintenant" pour forcer la synchronisation

## 🎨 Composants Utilisables

### Hook `useOnlineStatus`
```typescript
import { useOnlineStatus } from '../hooks/useOnlineStatus';

function MyComponent() {
  const isOnline = useOnlineStatus();
  
  return (
    <div>
      {isOnline ? '🌐 En ligne' : '📡 Hors ligne'}
    </div>
  );
}
```

### Service `localDBService`
```typescript
import { localDBService } from '../services/localDB.service';

// Créer un utilisateur local
const user = await localDBService.createLocalUser(
  'john_doe', 
  'john@example.com', 
  'password123'
);

// Récupérer les utilisateurs non synchronisés
const unsyncedUsers = await localDBService.getUnsyncedUsers();

// Compter les utilisateurs en attente
const count = await localDBService.countUnsyncedUsers();
```

### Service `userSyncService`
```typescript
import { userSyncService } from '../services/userSync.service';

// Créer et synchroniser automatiquement
const result = await userSyncService.createAndSyncUser(
  'john_doe',
  'john@example.com',
  'password123',
  isOnline
);

// Synchroniser tous les utilisateurs en attente
const results = await userSyncService.syncAllPendingUsers();
```

### Contexte `AuthContext`
```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { unsyncedUsersCount, syncPendingUsers } = useAuth();
  
  return (
    <div>
      <p>{unsyncedUsersCount} utilisateur(s) en attente</p>
      <button onClick={syncPendingUsers}>
        Synchroniser
      </button>
    </div>
  );
}
```

## 📊 Base de Données

### IndexedDB (Local)
```javascript
{
  id: "local-1234567890-abc123",
  username: "john_doe",
  email: "john@example.com",
  password: "hashed_password",
  createdAt: "2026-02-09T20:00:00Z",
  syncedToFirebase: false,
  firebaseUid: null,
  syncError: null
}
```

### Firebase Firestore
```javascript
// Collection: users
// Document ID: firebase_auth_uid
{
  username: "john_doe",
  email: "john@example.com",
  createdAt: "2026-02-09T20:00:00Z",
  syncedAt: "2026-02-09T20:05:00Z",
  localId: "local-1234567890-abc123",
  isActive: true
}
```

## ⚠️ Gestion des Erreurs

### Email déjà existant
Si un email existe déjà dans Firebase :
- ❌ La synchronisation échoue
- 🔴 L'erreur est enregistrée dans `syncError`
- 📊 L'utilisateur reste en local avec un badge "Erreur"

### Échec de connexion
Si la connexion échoue pendant la synchronisation :
- 🔄 L'utilisateur reste en attente
- 🔁 Une nouvelle tentative sera faite au prochain événement "online"

## 🧪 Tests

### Test 1 : Création en ligne
1. Vérifier que la connexion est active
2. Créer un utilisateur
3. ✅ Vérifier qu'il apparaît immédiatement dans Firebase

### Test 2 : Création hors ligne
1. Activer le mode offline (DevTools)
2. Créer plusieurs utilisateurs
3. ✅ Vérifier qu'ils sont stockés en local
4. Désactiver le mode offline
5. ✅ Vérifier la synchronisation automatique

### Test 3 : Gestion d'erreurs
1. Créer un utilisateur en ligne
2. Passer en mode offline
3. Créer un utilisateur avec le même email
4. Revenir en ligne
5. ✅ Vérifier que l'erreur est capturée

## 🔐 Sécurité

⚠️ **Important** : Le mot de passe est stocké en clair dans IndexedDB localement.

**Recommandations pour la production :**
1. Ne stocker que le hash du mot de passe
2. Utiliser un token temporaire
3. Chiffrer les données sensibles dans IndexedDB
4. Implémenter une expiration des données locales

## 🎉 Avantages

✅ **Fonctionne offline** : Pas de perte de données même sans connexion
✅ **Synchronisation automatique** : Aucune intervention manuelle requise
✅ **Transparence** : L'utilisateur voit clairement l'état de synchronisation
✅ **Résilient** : Gère les erreurs et les tentatives multiples
✅ **Performant** : IndexedDB est très rapide pour le stockage local

## 📝 Notes Additionnelles

- Les données persistent dans le navigateur (même après fermeture)
- Chaque navigateur a sa propre base IndexedDB
- Effacer les données du navigateur supprimera les utilisateurs non synchronisés
- La synchronisation peut prendre quelques secondes selon le nombre d'utilisateurs

## 🔗 Ressources

- [IndexedDB API](https://developer.mozilla.org/fr/docs/Web/API/IndexedDB_API)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [idb Library](https://github.com/jakearchibald/idb)
