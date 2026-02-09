# 🔧 Guide pour Tester le Blocage de Compte

## ⚠️ ÉTAPE 1 : RECOMPILER LE BACKEND (OBLIGATOIRE!)

Le backend DOIT être recompilé pour appliquer le nouveau message d'erreur.

### Ouvrir PowerShell et exécuter :

```powershell
# Navigue au dossier backend
cd "c:\Users\Fitahiana\Documents\S5\ProjetS5Cloud\backend"

# Arrête le serveur actuel (Ctrl+C bien sûr!)
# ou tue le processus Java avec :
taskkill /F /IM java.exe

# Nettoie et compile
mvn clean install -DskipTests

# Démarre le serveur
mvn spring-boot:run
```

**Attends jusqu'à voir :** `Tomcat started on port 8081` ✅

---

## ⚠️ ÉTAPE 2 : RESET LA BASE DE DONNÉES

Si Fitahiana a déjà 3 tentatives échouées, réinitialise :

### Dans psql ou pgAdmin :

```sql
-- Réinitialiser le blocage
UPDATE login_attempts 
SET attempts = 0, blocked = false, blocked_until = NULL
WHERE identifier = 'Fitahiana';

-- Vérifier
SELECT * FROM login_attempts WHERE identifier = 'Fitahiana';
```

---

## ✅ ÉTAPE 3 : TESTER

1. **Ouvre** : http://localhost:5173/login
2. **Entre** :
   - Username : `Fitahiana`
   - Password : `wrongpass` (intentionnellement faux)
3. **Clique le bouton** "Se connecter"
4. **Répète 3 fois** → Après la 3e tentative, tu devrais voir :

```
❌ COMPTE BLOQUÉ - Vous avez dépassé le nombre de tentatives 
autorisées (3). Votre compte est bloqué pour [X minute(s)]. 
Vous pouvez demander un déblocage à un manager ci-dessous.

[Bouton Orange] "Demander un déblocage au manager"
```

---

## 🔍 DÉBOGUER

### Ouvre la Console du Navigateur (F12)

Si le message n'apparaît pas, regarde les logs :

```
Error de connexion complète: ...
Response: {...}
Data: {...}
Message d'erreur final: ...
```

Ces logs t'aideront à voir exactement ce que le backend envoie.

---

## 🔐 TESTER LE DÉBLOCAGE MANAGER

1. Connecte-toi avec un compte MANAGER
2. Dans le sidebar, clique sur **🔒 Comptes bloqués**
3. Tu verras la liste des utilisateurs bloqués
4. Clique le bouton **"Débloquer"** pour la ligne Fitahiana
5. Essaie de te reconnecter avec Fitahiana → ça devrait marcher !

---

## 📞 SI ÇA NE MARCHE TOUJOURS PAS

Envoie-moi les logs du navigateur (F12) et les logs du backend (PowerShell).
