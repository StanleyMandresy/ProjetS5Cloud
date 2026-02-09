# 🧪 Guide de Test de l'API Backend

## 📍 Accès Swagger UI

Ouvrez dans votre navigateur :
```
http://localhost:8081/swagger-ui/index.html
```

---

## 🔧 Tests avec curl

### 1️⃣ Health Check

```bash
curl -s http://localhost:8080/api/auth/health | python3 -m json.tool
```

**Réponse attendue :**
```json
{
    "status": "UP",
    "message": "API d'authentification opérationnelle"
}
```

---

### 2️⃣ Register (Inscription)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "securepass123"
  }' | python3 -m json.tool
```

**Réponse attendue :**
```json
{
    "message": "Inscription réussie",
    "userId": 1,
    "username": "alice",
    "email": "alice@example.com",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### 3️⃣ Login (Connexion)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "securepass123"
  }' | python3 -m json.tool
```

**Réponse attendue :**
```json
{
    "message": "Connexion réussie",
    "userId": 1,
    "username": "alice",
    "email": "alice@example.com",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**💡 Astuce :** Sauvegardez le token dans une variable :
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"securepass123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
```

---

### 4️⃣ Get Profile (Récupérer le profil)

```bash
# Remplacez {userId} par l'ID de l'utilisateur
curl -X GET http://localhost:8080/api/auth/profile/1 \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

**Réponse attendue :**
```json
{
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "isActive": true,
    "createdAt": "2026-01-20T08:30:00"
}
```

---

### 5️⃣ Update Profile (Mettre à jour le profil)

```bash
curl -X PUT http://localhost:8080/api/auth/profile/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "alice_updated",
    "email": "alice.new@example.com",
    "currentPassword": "securepass123",
    "password": "newsecurepass456"
  }' | python3 -m json.tool
```

**Réponse attendue :**
```json
{
    "message": "Profil mis à jour avec succès",
    "userId": 1,
    "username": "alice_updated",
    "email": "alice.new@example.com",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## 🚀 Script de Test Automatique

Utilisez le script fourni pour tester tous les endpoints :

```bash
./test-api.sh
```

---

## 📋 Endpoints disponibles

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| GET | `/api/auth/health` | Health check | ❌ |
| POST | `/api/auth/register` | Inscription | ❌ |
| POST | `/api/auth/login` | Connexion | ❌ |
| GET | `/api/auth/profile/{userId}` | Récupérer profil | ✅ |
| PUT | `/api/auth/profile/{userId}` | Modifier profil | ✅ |

---

## 🔐 Authentification JWT

Pour les endpoints protégés, ajoutez le header :
```
Authorization: Bearer {votre_token_jwt}
```

---

## ⚠️ Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non autorisé |
| 404 | Non trouvé |
| 500 | Erreur serveur |

---

## 📊 Base de données

Les tables créées :
- `utilisateur` - Utilisateurs
- `role` - Rôles
- `entreprise` - Entreprises
- `point_de_reparation` - Points de réparation avec géométrie PostGIS

Pour voir les utilisateurs :
```bash
docker exec -i postgres_postgis psql -U admin -d projet-cloud-db -c "SELECT * FROM utilisateur;"
```

---

## 🎨 Frontend

Le frontend est accessible sur :
```
http://localhost:3000
```

Avec la nouvelle palette de couleurs bleue (#caf0f8, #ade8f4, #90e0ef, #48cae4).
