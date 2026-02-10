@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM ###############################################################################
REM # Script de démarrage complet du projet - Système de Gestion des Réparations
REM # OS : Windows
REM # Date : 2026-02-10
REM ###############################################################################

REM Se placer à la racine du projet (2 niveaux au-dessus de configProjet)
pushd %~dp0..\..
echo 📂 Répertoire du projet : %CD%
echo.

color 0B
title Démarrage du Projet - Système de Gestion des Réparations

echo ╔════════════════════════════════════════════════════════════╗
echo ║  DÉMARRAGE DU PROJET - GESTION DES RÉPARATIONS             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ===============================================================================
REM  VÉRIFICATION DES PRÉREQUIS
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  VÉRIFICATION DES PRÉREQUIS                                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

docker --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Docker n'est pas installé
    pause
    exit /b 1
)
echo ✅ Docker est installé

docker-compose --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose n'est pas installé
    pause
    exit /b 1
)
echo ✅ Docker Compose est installé

docker info > nul 2>&1
if errorlevel 1 (
    echo ❌ Docker n'est pas démarré
    pause
    exit /b 1
)
echo ✅ Docker est actif
echo.

REM ===============================================================================
REM  NETTOYAGE DES CONTAINERS
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  NETTOYAGE DES CONTAINERS EXISTANTS                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

docker-compose down > nul 2>&1
echo ✅ Containers arrêtés
echo.

set /p CLEAN_DB="Voulez-vous réinitialiser la base de données ? (O/N) [N]: "
if /i "%CLEAN_DB%"=="O" (
    echo ⚠️  Suppression des volumes Docker...
    docker-compose down -v > nul 2>&1
    echo ✅ Volumes supprimés
)
echo.

REM ===============================================================================
REM  DÉMARRAGE DE POSTGRESQL
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  DÉMARRAGE DE POSTGRESQL                                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

docker-compose up -d postgres
echo ℹ️  Attente du démarrage de PostgreSQL...

set COUNTER=0
set MAX_ATTEMPTS=30

:WAIT_POSTGRES
docker exec postgres_postgis pg_isready -U admin -d projet-cloud-db > nul 2>&1
if errorlevel 1 (
    if !COUNTER! geq %MAX_ATTEMPTS% (
        echo ❌ PostgreSQL n'a pas démarré
        docker logs postgres_postgis
        pause
        exit /b 1
    )
    timeout /t 1 > nul
    set /a COUNTER+=1
    goto WAIT_POSTGRES
)

echo ✅ PostgreSQL prêt !
echo.

REM ===============================================================================
REM  INITIALISATION DE LA BASE DE DONNÉES
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  INITIALISATION DE LA BASE DE DONNÉES                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

for /f %%i in ('
    docker exec postgres_postgis psql -U admin -d projet-cloud-db -tAc ^
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name='utilisateur');"
') do set TABLE_EXISTS=%%i

if "%TABLE_EXISTS%"=="t" (
    echo ⚠️  Base déjà initialisée
    set /p RERUN_SQL="Réexécuter les scripts SQL ? (O/N) [N]: "
    if /i "!RERUN_SQL!"=="O" set EXEC_SQL=true
) else (
    set EXEC_SQL=true
)

if "!EXEC_SQL!"=="true" (

    echo ▶ Exécution base-finale.sql
    docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < base\base-finale.sql
    if errorlevel 1 (
        echo ❌ Erreur base-finale.sql
        pause
        exit /b 1
    )

    echo ▶ Exécution data-finale.sql
    docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < base\data-finale.sql
    if errorlevel 1 (
        echo ❌ Erreur data-finale.sql
        pause
        exit /b 1
    )

    echo ✅ Base de données initialisée
)
echo.

REM ===============================================================================
REM  DÉMARRAGE BACKEND
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  DÉMARRAGE DU BACKEND SPRING BOOT                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

docker-compose up -d --build backend
echo ℹ️  Attente du backend...

set COUNTER=0
set MAX_ATTEMPTS=60

:WAIT_BACKEND
curl -s http://localhost:8081/actuator/health > nul 2>&1
if errorlevel 1 (
    if !COUNTER! geq %MAX_ATTEMPTS% (
        echo ⚠️  Backend long à démarrer
        goto START_FRONTEND
    )
    timeout /t 1 > nul
    set /a COUNTER+=1
    goto WAIT_BACKEND
)

echo ✅ Backend démarré
echo.

:START_FRONTEND

REM ===============================================================================
REM  DÉMARRAGE FRONTEND
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  DÉMARRAGE DU FRONTEND REACT                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

docker-compose up -d --build frontend
timeout /t 5 > nul
echo ✅ Frontend démarré
echo.

REM ===============================================================================
REM  DÉMARRAGE TILESERVER
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  DÉMARRAGE DU TILESERVER                                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

docker-compose up -d tileserver
timeout /t 3 > nul
echo ✅ TileServer démarré
echo.

REM ===============================================================================
REM  FIN
REM ===============================================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║   🚀 PROJET DÉMARRÉ AVEC SUCCÈS ! 🚀                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Frontend  : http://localhost:3000
echo 🔧 Backend   : http://localhost:8081
echo 📘 Swagger   : http://localhost:8081/swagger-ui.html
echo 🗺️  TileServer: http://localhost:8000
echo 🐘 PostgreSQL: localhost:5433 (admin/admin)
echo.
pause
