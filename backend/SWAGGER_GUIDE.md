# 📚 Documentation Swagger - Guide Complet

## ✅ Swagger est maintenant configuré !

Votre API est désormais documentée avec **Swagger/OpenAPI 3.0** grâce à **SpringDoc**.

---

## 🌐 Accès à la documentation

### 1. Interface Swagger UI (Interface interactive)
```
http://localhost:8080/swagger-ui/index.html
```
OU
```
http://localhost:8080/swagger-ui.html
```

👉 **Interface graphique** pour tester directement vos endpoints

### 2. Spécification OpenAPI JSON
```
http://localhost:8080/v3/api-docs
```

👉 Fichier JSON de la spécification OpenAPI pour intégration avec d'autres outils

---

## 🎯 Comment utiliser Swagger UI

### 1. Tester un endpoint PUBLIC (sans authentification)

**Exemple : Health Check**
1. Ouvrez `http://localhost:8080/swagger-ui/index.html`
2. Cliquez sur **GET /api/auth/health**
3. Cliquez sur **Try it out**
4. Cliquez sur **Execute**
5. Voir la réponse dans la section **Response body**

**Exemple : Inscription**
1. Cliquez sur **POST /api/auth/register**
2. Cliquez sur **Try it out**
3. Modifiez le JSON dans **Request body** :
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
4. Cliquez sur **Execute**
5. Copiez le **token** de la réponse

---

### 2. Tester un endpoint PROTÉGÉ (avec authentification JWT)

**Étape 1 : S'authentifier**
1. Récupérez le token via l'endpoint **POST /api/auth/login** ou **POST /api/auth/register**

**Étape 2 : Configurer l'authentification dans Swagger**
1. Cliquez sur le bouton **Authorize** (cadenas vert en haut à droite)
2. Dans le champ **Value**, entrez :
```
Bearer eyJhbGciOiJIUzI1NiJ9.votre_token_ici...
```
3. Cliquez sur **Authorize**
4. Cliquez sur **Close**

**Étape 3 : Tester l'endpoint protégé**
1. Cliquez sur **GET /api/auth/profile/{userId}**
2. Cliquez sur **Try it out**
3. Entrez un **userId** (par exemple : 1)
4. Cliquez sur **Execute**
5. Voir la réponse (l'authentification est automatiquement incluse)

---

## 🔧 Configuration actuelle

### 1. Dépendance Maven (pom.xml)
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### 2. Configuration OpenAPI (OpenApiConfig.java)
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API d'Authentification")
                        .version("1.0.0")
                        .description("Service d'authentification RESTful avec JWT"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
```

### 3. Configuration Spring Security
Les endpoints Swagger sont configurés pour être **publics** (pas d'authentification requise) :
- `/swagger-ui/**`
- `/v3/api-docs/**`
- `/swagger-ui.html`

### 4. Configuration application.properties
```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
```

---

## 📝 Annotations utilisées sur les endpoints

### Sur le contrôleur
```java
@Tag(name = "Authentification", description = "API de gestion de l'authentification et des utilisateurs")
public class AuthController {
```

### Sur chaque méthode
```java
@Operation(
    summary = "Inscription d'un nouvel utilisateur",
    description = "Crée un nouveau compte utilisateur avec username, email et mot de passe. Retourne un token JWT."
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "201",
        description = "Utilisateur créé avec succès",
        content = @Content(schema = @Schema(implementation = AuthResponse.class))
    ),
    @ApiResponse(
        responseCode = "400",
        description = "Données invalides",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class))
    )
})
@PostMapping("/register")
public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
```

### Pour les endpoints protégés
```java
@Operation(
    summary = "Modifier le profil utilisateur",
    security = @SecurityRequirement(name = "bearerAuth")  // ← Indique que JWT est requis
)
```

---

## 🎨 Personnalisation avancée

### 1. Changer le titre et la description
Modifier `OpenApiConfig.java` :
```java
.info(new Info()
    .title("Mon API Custom")
    .version("2.0.0")
    .description("Description personnalisée")
    .contact(new Contact()
        .name("Votre Nom")
        .email("contact@votredomaine.com")))
```

### 2. Ajouter des serveurs
```java
.servers(List.of(
    new Server()
        .url("http://localhost:8080")
        .description("Développement local"),
    new Server()
        .url("https://api.production.com")
        .description("Production")))
```

### 3. Grouper les endpoints par tags
```java
@Tag(name = "Utilisateurs", description = "Gestion des utilisateurs")
@Tag(name = "Authentication", description = "Connexion et tokens")
```

### 4. Documenter les paramètres
```java
public ResponseEntity<?> getProfile(
    @Parameter(description = "ID de l'utilisateur", required = true, example = "1")
    @PathVariable Long userId) {
```

### 5. Documenter les modèles (DTOs)
```java
@Schema(description = "Requête de connexion utilisateur")
public class LoginRequest {
    
    @Schema(description = "Nom d'utilisateur", example = "john_doe", required = true)
    private String username;
    
    @Schema(description = "Mot de passe", example = "password123", required = true)
    private String password;
}
```

---

## 🚀 Intégrations possibles

### 1. Export en PDF/HTML
Utilisez des outils comme **Redoc** ou **swagger-codegen** pour générer de la documentation statique

### 2. Génération de clients
```bash
# Générer un client JavaScript
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:8080/v3/api-docs \
  -g javascript \
  -o ./frontend/api-client
```

### 3. Tests avec Postman
1. Importer la spécification OpenAPI dans Postman
2. File → Import → URL : `http://localhost:8080/v3/api-docs`

### 4. Validation avec Swagger Editor
1. Copier le JSON de `/v3/api-docs`
2. Coller dans https://editor.swagger.io/

---

## 📋 Endpoints documentés

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/api/auth/register` | Inscription | ❌ |
| `POST` | `/api/auth/login` | Connexion | ❌ |
| `PUT` | `/api/auth/profile/{userId}` | Modifier profil | ✅ JWT |
| `GET` | `/api/auth/profile/{userId}` | Récupérer profil | ✅ JWT |
| `GET` | `/api/auth/health` | Health check | ❌ |

---

## 🔍 Vérification

Testez que tout fonctionne :

```bash
# 1. Vérifier l'API OpenAPI JSON
curl http://localhost:8080/v3/api-docs | jq .

# 2. Vérifier Swagger UI
curl http://localhost:8080/swagger-ui/index.html

# 3. Tester un endpoint documenté
open http://localhost:8080/swagger-ui/index.html
```

---

## 💡 Bonnes pratiques

✅ **Documenter tous les endpoints** avec `@Operation`  
✅ **Décrire les réponses possibles** avec `@ApiResponses`  
✅ **Ajouter des exemples** dans les schémas  
✅ **Grouper par fonctionnalité** avec `@Tag`  
✅ **Décrire les paramètres** avec `@Parameter`  
✅ **Protéger Swagger en production** (authentification basique)  
✅ **Versionner votre API** dans le titre  

---

## 🎉 Résultat

Votre API est maintenant **professionnellement documentée** et **testable interactivement** via Swagger UI !

**Accès direct** : http://localhost:8080/swagger-ui/index.html
