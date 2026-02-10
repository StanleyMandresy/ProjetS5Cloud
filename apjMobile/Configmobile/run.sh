#!/bin/bash

# ============================================================
#   SIGNALISATION MOBILE - COMMANDES UTILES
# ============================================================

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Se placer dans le bon dossier
cd "$(dirname "$0")"

show_menu() {
    clear
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${GREEN}   SIGNALISATION MOBILE - COMMANDES UTILES${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    echo -e " Dossier: mobile-app/signalisation-mobile"
    echo ""
    echo -e " ${YELLOW}[1]${NC} Lancer l'app en mode developpement (ionic serve)"
    echo -e " ${YELLOW}[2]${NC} Build + Sync Android (preparation APK)"
    echo -e " ${YELLOW}[3]${NC} Tout faire (Build + Sync + Android Studio)"
    echo ""
    echo -e " ${RED}[0]${NC} Quitter"
    echo ""
    echo -e "${BLUE}============================================================${NC}"
}

dev_server() {
    echo -e "${GREEN}Lancement en mode developpement...${NC}"
    npx ionic serve
}

build_sync() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${GREEN}Etape 1/2 : Compilation web (npm run build)${NC}"
    echo -e "${BLUE}============================================================${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERREUR: La compilation a echoue!${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${GREEN}Etape 2/2 : Synchronisation Android (npx cap sync android)${NC}"
    echo -e "${BLUE}============================================================${NC}"
    npx cap sync android
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERREUR: La synchronisation a echoue!${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${GREEN}Build et Sync termines avec succes!${NC}"
}

do_all() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${GREEN}PROCESSUS COMPLET : Build + Sync + Android Studio${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    
    echo -e "${YELLOW}[1/3]${NC} Compilation web..."
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERREUR: Compilation echouee!${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${YELLOW}[2/3]${NC} Synchronisation Android..."
    npx cap sync android
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERREUR: Sync echouee!${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${YELLOW}[3/3]${NC} Ouverture Android Studio..."
    npx cap open android
    
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${GREEN}Termine! Android Studio devrait s'ouvrir.${NC}"
    echo -e "Dans Android Studio: Build > Build Bundle(s) / APK(s) > Build APK"
    echo -e "${BLUE}============================================================${NC}"
}

# Boucle principale
while true; do
    show_menu
    read -p "Votre choix: " choix
    
    case $choix in
        1)
            dev_server
            read -p "Appuyez sur Entree pour continuer..."
            ;;
        2)
            build_sync
            read -p "Appuyez sur Entree pour continuer..."
            ;;
        3)
            do_all
            read -p "Appuyez sur Entree pour continuer..."
            ;;
        0)
            echo "Au revoir!"
            exit 0
            ;;
        *)
            echo -e "${RED}Choix invalide!${NC}"
            sleep 1
            ;;
    esac
done
