# 🚀 Scripts de Gestion du Projet

Scripts automatisés pour démarrer et arrêter l'ensemble du projet.

## 📁 Fichiers

- **start-project.sh** / **start-project.bat** - Démarrage complet
- **stop-project.sh** / **stop-project.bat** - Arrêt propre

## ▶️ Démarrage

### Linux / macOS
```bash
./start-project.sh
```

### Windows
```cmd
start-project.bat
```

Le script effectue automatiquement :
1. ✅ Vérification Docker
2. 🧹 Nettoyage des containers
3. 🗄️ Démarrage PostgreSQL
4. 📊 Exécution des scripts SQL
5. ⚙️ Build et démarrage backend
6. 🎨 Build et démarrage frontend
7. 🗺️ Démarrage TileServer
8. ✅ Vérification complète

## ⏹️ Arrêt

### Linux / macOS
```bash
./stop-project.sh
```

### Windows
```cmd
stop-project.bat
```

Options :
- Arrêt simple (conserve les données)
- Arrêt avec suppression des volumes (reset complet)

## 📖 Documentation

Consultez [README_STARTUP.md](../../README_STARTUP.md) pour le guide complet.
