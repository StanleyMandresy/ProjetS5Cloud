# 📮 Collection Postman - API Documentation

## 🚀 Import de la collection

1. Ouvrez Postman
2. Cliquez sur **Import** en haut à gauche
3. Glissez-déposez le fichier `Postman_Collection.json` ou cliquez sur "Upload Files"
4. La collection "Projet S5 Cloud - API Collection" apparaîtra dans votre workspace

## 🔧 Configuration

### Variables de collection
Deux variables sont pré-configurées :

- **`baseUrl`** : `http://localhost:8081/api` (modifiable selon votre environnement)
- **`token`** : Vide au départ, se remplit automatiquement après connexion

### Modifier le baseUrl
Si votre API tourne sur un autre port ou domaine :
1. Cliquez sur la collection
2. Onglet "Variables"
3. Modifiez la valeur de `baseUrl`

## 📝 Utilisation

### 1️⃣ Authentification

**Étape 1 : Register (optionnel)**
```
POST /auth/register
```
Créez un compte avec les rôles : `MANAGER` ou `UTILISATEUR`

**Étape 2 : Login**
```
POST /auth/login
```
✅ Le token JWT est **automatiquement stocké** dans la variable `{{token}}`
✅ Toutes les requêtes suivantes l'utilisent automatiquement

### 2️⃣ Tester les APIs

Une fois connecté, toutes les autres requêtes utiliseront automatiquement le token.

## 📂 Structure de la collection

### 🔐 Authentication
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter (stocke le token auto)

### 🛣️ Points de Réparation
- `GET /travaux/points` - Liste tous les points
- `GET /travaux/points/:id` - Détail d'un point
- `GET /travaux/points/statut/:statut` - Filtrer par statut
- `POST /travaux/points` - Créer un point
- `PUT /travaux/points/:id` - Mettre à jour
- `PUT /travaux/points/:id/niveau-reparation` - Changer niveau
- `DELETE /travaux/points/:id` - Supprimer
- `GET /travaux/historique/:id` - Historique des changements

### 📊 Statistiques
- `GET /travaux/statistiques` - Stats générales
- `GET /travaux/statistiques/traitement` - Stats de traitement

### 📋 Étapes
- `GET /etapes` - Liste des étapes
- `POST /etapes` - Créer une étape
- `PUT /etapes/:id` - Modifier une étape
- `DELETE /etapes/:id` - Supprimer une étape

### ⚙️ Configuration
- `GET /configuration` - Toutes les configs
- `GET /configuration/prix-par-m2` - Prix actuel
- `PUT /configuration/prix-par-m2` - Modifier prix (MANAGER)
- `POST /configuration/calculer-budget` - Calculer budget

## 💡 Exemples de Body

### Créer un point de réparation
```json
{
  "titre": "Réparation route principale",
  "description": "Nids de poule à réparer",
  "latitude": -18.8792,
  "longitude": 47.5079,
  "statut": "NOUVEAU",
  "surfaceM2": 150.5,
  "niveauReparation": 5,
  "entrepriseId": 1
}
```

💰 **Budget calculé automatiquement** : `prix_par_m2 × niveau × surface`

### Mettre à jour un point
```json
{
  "statut": "EN_COURS",
  "dateDebutTravaux": "2026-02-10",
  "surfaceM2": 200,
  "niveauReparation": 7
}
```

### Calculer un budget
```json
{
  "surfaceM2": 100,
  "niveauReparation": 5
}
```
Exemple : `10,000 Ar/m² × 5 × 100 m² = 5,000,000 Ar`

## 🔒 Règles de Protection des Statuts

- **TERMINE (100%)** : ❌ Plus aucun changement possible
- **EN_COURS (50%)** : ✅ Peut → TERMINE | ❌ Ne peut pas → NOUVEAU
- **NOUVEAU (0%)** : ✅ Peut aller partout

## 🎯 Tests rapides

Pour vérifier que tout fonctionne :

1. **Login** → Vérifiez que `{{token}}` est rempli
2. **Get All Points** → Devrait retourner la liste
3. **Get Statistiques** → Devrait afficher les métriques
4. **Get Prix par m²** → Devrait retourner `10000` par défaut
5. **Calculer Budget** → Testez avec surface=100, niveau=5

## 🐛 Dépannage

### Token expiré
Si vous obtenez une erreur 401/403 :
1. Relancez la requête **Login**
2. Le token sera automatiquement mis à jour

### Erreur 404
Vérifiez que :
- Le backend tourne sur `http://localhost:8081`
- Docker container `spring_backend` est actif : `docker ps`

### Change baseUrl
Pour un environnement de production :
```
baseUrl = https://votre-domaine.com/api
```

## 📚 Documentation API

### Codes de statut
- `200` : Succès
- `201` : Créé avec succès
- `400` : Erreur de validation
- `401` : Non authentifié
- `403` : Non autorisé (mauvais rôle)
- `404` : Ressource non trouvée
- `500` : Erreur serveur

### Rôles utilisateurs
- **MANAGER** : Accès complet (création, modification, suppression)
- **UTILISATEUR** : Lecture seule

---

🎉 **Collection prête à l'emploi !** Importez et testez vos APIs en quelques clics.
