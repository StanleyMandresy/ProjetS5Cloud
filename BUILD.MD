# Run the stack

Prerequisites:
- Docker Desktop running and signed in (for image pulls)
- Ports free: 3000, 8081, 5433, 8000

First-time start (creates and builds services):

```bash
cd /Users/apple/Documents/GitHub/ProjetS5Cloud
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

Seed database (optional):

```bash
docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < backend/sql/base.sql
```

Stop and remove:

```bash
docker compose down
```

Note: Use `docker compose start` only after containers exist (i.e. after `up`). If you run `start` before `up`, Compose will report `could not find backend`.

---

## Test Local Complet

### 1. Vérifier que tous les conteneurs sont démarrés

```bash
docker compose ps
```

**Attendu :** Les 4 services doivent être `Up` et `healthy` (postgres) :
- `postgres_postgis` - port 5433
- `spring_backend` - port 8081
- `frontend_react` - port 3000
- `tileserver` - port 8000

### 2. Tester la Base de Données

**⚠️ Problème d'authentification ?**

Si vous avez l'erreur `password authentication failed for user "admin"`, c'est qu'un ancien volume postgres existe avec d'autres credentials. Solution :

```bash
# Arrêter et supprimer les conteneurs + volumes
docker compose down -v

# Redémarrer (va créer un nouveau volume avec les bons credentials)
docker compose up -d --build

# Attendre que postgres soit healthy
docker compose ps
```

**Connexion directe à PostgreSQL :**

```bash
docker exec -it postgres_postgis psql -U admin -d projet-cloud-db
```

**Credentials de la base :**
- **Host:** localhost
- **Port:** 5433 (externe) / 5432 (interne)
- **Database:** projet-cloud-db
- **User:** admin
- **Password:** admin

**Dans psql, vérifier les tables :**

```sql
\dt
SELECT * FROM utilisateur LIMIT 5;
SELECT * FROM entreprise;
SELECT * FROM point_de_reparation;
\q
```

**Connexion avec un client externe (DBeaver, pgAdmin, etc.) :**

```
Host: localhost
Port: 5433
Database: projet-cloud-db
Username: admin
Password: admin
```

**Charger les données de test :**

```bash
# Données initiales (schéma)
docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < backend/sql/base.sql

# Données d'exemple (entreprises + points de réparation)
docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < base/data1.sql
```

**Créer un utilisateur avec rôle MANAGER :**

```bash
# Méthode 1 : Via psql directement
docker exec -it postgres_postgis psql -U admin -d projet-cloud-db << 'EOF'
INSERT INTO utilisateur (nom, email, mot_de_passe, role) 
VALUES ('Manager Admin', 'manager@example.com', '$2a$10$abcdefghijklmnopqrstuv', 'MANAGER');
EOF

# Méthode 2 : Via l'API puis mise à jour SQL
# 1. D'abord créer l'utilisateur via l'API (sera USER par défaut)
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager1",
    "email": "manager1@example.com",
    "password": "manager123"
  }'

# 2. Puis changer son rôle en MANAGER
docker exec -it postgres_postgis psql -U admin -d projet-cloud-db -c \
  "UPDATE utilisateur SET role = 'MANAGER' WHERE email = 'manager1@example.com';"

# Vérifier
docker exec -it postgres_postgis psql -U admin -d projet-cloud-db -c \
  "SELECT id_utilisateur, nom, email, role FROM utilisateur WHERE role = 'MANAGER';"
```

**Créer un script SQL pour plusieurs utilisateurs :**

```sql
-- Créer un fichier create-managers.sql
-- puis l'exécuter avec : docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < create-managers.sql

-- Utilisateur MANAGER
INSERT INTO utilisateur (nom, email, mot_de_passe, role) 
VALUES ('John Manager', 'john.manager@example.com', 'hashed_password_here', 'MANAGER')
ON CONFLICT (email) DO NOTHING;

-- Utilisateur USER normal
INSERT INTO utilisateur (nom, email, mot_de_passe, role) 
VALUES ('Alice User', 'alice@example.com', 'hashed_password_here', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Utilisateur VISITEUR
INSERT INTO utilisateur (nom, email, mot_de_passe, role) 
VALUES ('Bob Visitor', 'bob@example.com', 'hashed_password_here', 'VISITEUR')
ON CONFLICT (email) DO NOTHING;
```

**Note sur les mots de passe :**  
Les mots de passe sont hashés avec BCrypt. Pour créer un hash manuellement :

```bash
# En Python
python3 -c "from passlib.hash import bcrypt; print(bcrypt.hash('votre_mot_de_passe'))"

# Ou utiliser l'API pour créer l'utilisateur, puis mettre à jour juste le rôle
```

### 3. Tester le Backend (API REST)

**Health check :**

```bash
curl -s http://localhost:8081/api/auth/health | python3 -m json.tool
```

**Swagger UI :**

Ouvrir dans le navigateur : [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)

**Test inscription :**

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' | python3 -m json.tool
```

**Test connexion :**

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }' | python3 -m json.tool
```

**Sauvegarder le token :**

```bash
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' | jq -r '.token')

echo "Token: $TOKEN"
```

**Test endpoint protégé :**

```bash
curl -X GET http://localhost:8081/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### 4. Tester le Frontend

Ouvrir dans le navigateur : [http://localhost:3000](http://localhost:3000)

**Vérifications :**
- ✅ Page de login s'affiche
- ✅ Inscription d'un nouvel utilisateur
- ✅ Connexion avec les credentials
- ✅ Redirection vers la page d'accueil après login
- ✅ Carte interactive s'affiche
- ✅ Profil utilisateur accessible

**Logs du frontend :**

```bash
docker logs frontend_react -f
```

### 5. Tester le TileServer

Ouvrir dans le navigateur : [http://localhost:8000](http://localhost:8000)

**Vérifier les tuiles disponibles :**

```bash
curl -s http://localhost:8000/data/v3.json | python3 -m json.tool
```

### 6. Tests Automatisés Complets

Utiliser le script de test fourni :

```bash
chmod +x test-api.sh
./test-api.sh
```

### 7. Vérifier les Logs

**Tous les services :**

```bash
docker compose logs -f
```

**Un service spécifique :**

```bash
docker logs spring_backend -f
docker logs postgres_postgis -f
docker logs frontend_react -f
docker logs tileserver -f
```

### 8. Debugging

**Entrer dans un conteneur :**

```bash
# Backend
docker exec -it spring_backend /bin/bash

# Frontend
docker exec -it frontend_react /bin/sh

# Postgres
docker exec -it postgres_postgis /bin/bash
```

**Vérifier les variables d'environnement :**

```bash
docker exec spring_backend env | grep DB_
```

**Rebuild un service spécifique :**

```bash
docker compose up -d --build backend
```

### 9. URLs de Référence

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Application React |
| Backend API | http://localhost:8081/api | API REST Spring Boot |
| Swagger UI | http://localhost:8081/swagger-ui/index.html | Documentation interactive API |
| Postgres | localhost:5433 | Base de données (user: admin, pass: admin) |
| TileServer | http://localhost:8000 | Serveur de tuiles cartographiques |

### 10. Troubleshooting

**Backend ne démarre pas :**

```bash
# Vérifier que postgres est healthy
docker compose ps
docker logs spring_backend

# Restart le backend
docker compose restart backend
```

**Frontend ne se connecte pas au backend :**

Vérifier la variable d'environnement `VITE_API_URL` :

```bash
docker exec frontend_react env | grep VITE_API_URL
```

Devrait pointer vers `http://localhost:8081/api` ou le backend doit accepter les requêtes CORS.

**Base de données vide après initialisation :**

```bash
# Vérifier que le fichier SQL existe
ls -lh backend/sql/base.sql

# Réexécuter avec logs
docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < backend/sql/base.sql
```

**Ports déjà utilisés :**

```bash
# Identifier le processus
lsof -i :8081
lsof -i :3000
lsof -i :5433

# Changer les ports dans docker-compose.yml si nécessaire
```

