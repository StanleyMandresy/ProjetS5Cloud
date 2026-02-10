# API d'Authentification - Documentation

## 🚀 Endpoints disponibles

### Base URL
```
http://localhost:8080/api/auth/profile/{userId}
```

---

## 1. 📝 Inscription (Register)

**Endpoint:** `POST /api/auth/register`

**Description:** Créer un nouveau compte utilisateur

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validations:**
- `username`: Obligatoire, entre 3 et 50 caractères
- `email`: Obligatoire, format email valide
- `password`: Obligatoire, minimum 6 caractères

**Response Success (201):**
```json
{
  "message": "Inscription réussie",
  "userId": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```json
{
  "message": "Le nom d'utilisateur existe déjà",
  "status": 400,
  "timestamp": "2026-01-20T10:30:00"
}
```

---

## 2. 🔐 Connexion (Login)

**Endpoint:** `POST /api/auth/login`

**Description:** Se connecter avec identifiant et mot de passe

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Validations:**
- `username`: Obligatoire
- `password`: Obligatoire

**Response Success (200):**
```json
{
  "message": "Connexion réussie",
  "userId": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (401):**
```json
{
  "message": "Nom d'utilisateur ou mot de passe incorrect",
  "status": 401,
  "timestamp": "2026-01-20T10:30:00"
}
```

---

## 3. ✏️ Modification du profil (Update Profile)

**Endpoint:** `PUT /api/auth/profile/{userId}`

**Description:** Modifier les informations utilisateur (nom, email, mot de passe)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "username": "john_updated",
  "email": "john.new@example.com",
  "currentPassword": "password123",
  "password": "newPassword456"
}
```

**Notes:**
- Tous les champs sont optionnels
- Pour changer le mot de passe, `currentPassword` ET `password` sont requis
- Le serveur vérifie que le `currentPassword` est correct
- Les username/email doivent être uniques

**Response Success (200):**
```json
{
  "message": "Profil mis à jour avec succès",
  "userId": 1,
  "username": "john_updated",
  "email": "john.new@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```json
{
  "message": "Le mot de passe actuel est incorrect",
  "status": 400,
  "timestamp": "2026-01-20T10:30:00"
}
```

---

## 4. 👤 Récupérer le profil (Get Profile)

**Endpoint:** `GET /api/auth/profile/{userId}`

**Description:** Récupérer les informations d'un utilisateur

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "isActive": true,
  "createdAt": "2026-01-20T10:00:00"
}
```

**Response Error (404):**
```json
{
  "message": "Utilisateur non trouvé",
  "status": 404,
  "timestamp": "2026-01-20T10:30:00"
}
```

---

## 5. 🏥 Health Check

**Endpoint:** `GET /api/auth/health`

**Description:** Vérifier que l'API est opérationnelle

**Response Success (200):**
```json
{
  "status": "UP",
  "message": "API d'authentification opérationnelle"
}
```

---

## 🔑 Authentification JWT

Après connexion ou inscription, utilisez le token dans les headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Le token est valide pour **24 heures**.

---

## 📋 Exemples avec cURL

### Inscription
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Mise à jour du profil
```bash
curl -X PUT http://localhost:8080/api/auth/profile/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "newemail@example.com",
    "currentPassword": "password123",
    "password": "newPassword456"
  }'
```

### Récupérer le profil
```bash
curl -X GET http://localhost:8080/api/auth/profile/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
