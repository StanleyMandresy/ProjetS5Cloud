@echo off
chcp 65001 >nul
title Signalisation Mobile - Commandes Utiles

:MENU
cls
echo ============================================================
echo    SIGNALISATION MOBILE - COMMANDES UTILES
echo ============================================================
echo.
echo  Dossier: mobile-app/signalisation-mobile
echo.
echo  [1] Lancer l'app en mode developpement (ionic serve)
echo  [2] Tout faire (Build + Sync + Android Studio)
echo.
echo  [0] Quitter
echo.
echo ============================================================
set /p choix="Votre choix: "

if "%choix%"=="1" goto DEV
if "%choix%"=="2" goto BUILD_SYNC
if "%choix%"=="3" goto TOUT
if "%choix%"=="0" goto FIN
goto MENU

:DEV
cls
echo ============================================================
echo  Lancement en mode developpement...
echo ============================================================
cd /d "%~dp0"
call npx ionic serve
pause
goto MENU

:BUILD_SYNC
cls
echo ============================================================
echo  Etape 1/2 : Compilation web (npm run build)
echo ============================================================
cd /d "%~dp0"
call npm run build
if errorlevel 1 (
    echo.
    echo ERREUR: La compilation a echoue!
    pause
    goto MENU
)
echo.
echo ============================================================
echo  Etape 2/2 : Synchronisation Android (npx cap sync android)
echo ============================================================
call npx cap sync android
if errorlevel 1 (
    echo.
    echo ERREUR: La synchronisation a echoue!
    pause
    goto MENU
)
echo.
echo ============================================================
echo  Build et Sync termines avec succes!
echo ============================================================
pause
goto MENU

:TOUT
cls
echo ============================================================
echo  PROCESSUS COMPLET : Build + Sync + Android Studio
echo ============================================================
echo.
cd /d "%~dp0"

echo [1/3] Compilation web...
call npm run build
if errorlevel 1 (
    echo ERREUR: Compilation echouee!
    pause
    goto MENU
)

echo.
echo [2/3] Synchronisation Android...
call npx cap sync android
if errorlevel 1 (
    echo ERREUR: Sync echouee!
    pause
    goto MENU
)

echo.
echo [3/3] Ouverture Android Studio...
call npx cap open android

echo.
echo ============================================================
echo  Termine! Android Studio devrait s'ouvrir.
echo  Dans Android Studio: Build ^> Build Bundle(s) / APK(s) ^> Build APK
echo ============================================================
pause
goto MENU

:FIN
echo Au revoir!
exit
