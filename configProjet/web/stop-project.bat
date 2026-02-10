@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM ###############################################################################
REM # Script d'arrêt du projet - Système de Gestion des Réparations
REM # Compatible: Windows
REM ###############################################################################

REM Se placer à la racine du projet
pushd %~dp0..\..

color 0B
title Arrêt du Projet

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  ARRÊT DU PROJET - GESTION DES RÉPARATIONS                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Demander confirmation
set /p CONFIRM="Voulez-vous arrêter tous les services ? (O/N) [N]: "
if /i not "%CONFIRM%"=="O" (
    echo ⚠️  Annulé
    pause
    exit /b 0
)

REM Demander si suppression des volumes
echo.
set /p DELETE_DATA="Voulez-vous aussi supprimer les données ^(volumes^) ? (O/N) [N]: "
if /i "%DELETE_DATA%"=="O" (
    echo ℹ️  Arrêt des services et suppression des volumes...
    docker-compose down -v
    echo ✅ Services arrêtés et données supprimées
) else (
    echo ℹ️  Arrêt des services ^(conservation des données^)...
    docker-compose down
    echo ✅ Services arrêtés ^(données conservées^)
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  SERVICES ARRÊTÉS                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Pour redémarrer le projet :
echo   cd configProjet\web
echo   start-project.bat
echo.
pause
