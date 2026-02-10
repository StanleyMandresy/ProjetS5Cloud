#!/bin/bash

################################################################################
# Script d'arrêt du projet - Système de Gestion des Réparations
# Compatible: Linux / macOS
################################################################################

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Se placer à la racine du projet
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
cd "$PROJECT_ROOT"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ARRÊT DU PROJET - GESTION DES RÉPARATIONS                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Demander confirmation
read -p "Voulez-vous arrêter tous les services ? (o/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[OoYy]$ ]]; then
    echo -e "${YELLOW}⚠️  Annulé${NC}"
    exit 0
fi

# Demander si suppression des volumes (données)
echo ""
read -p "Voulez-vous aussi supprimer les données (volumes) ? (o/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[OoYy]$ ]]; then
    echo -e "${CYAN}ℹ️  Arrêt des services et suppression des volumes...${NC}"
    docker-compose down -v
    echo -e "${GREEN}✅ Services arrêtés et données supprimées${NC}"
else
    echo -e "${CYAN}ℹ️  Arrêt des services (conservation des données)...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Services arrêtés (données conservées)${NC}"
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                  SERVICES ARRÊTÉS                          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Pour redémarrer le projet :${NC}"
echo "  cd configProjet/web"
echo "  ./start-project.sh"
echo ""
