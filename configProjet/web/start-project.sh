#!/bin/bash

################################################################################
# Script de démarrage complet du projet - Système de Gestion des Réparations
# Compatible: Linux / macOS
# Date: 2026-02-10
################################################################################

set -e

# ------------------------------------------------------------------------------
# Se placer à la racine du projet (2 niveaux au-dessus de configProjet)
# ------------------------------------------------------------------------------
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
cd "$PROJECT_ROOT"

echo "📂 Répertoire du projet: $PROJECT_ROOT"
echo ""

# ------------------------------------------------------------------------------
# Couleurs
# ------------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info()    { echo -e "${CYAN}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error()   { echo -e "${RED}❌ $1${NC}"; }
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    printf  "${BLUE}║  %-58s ║${NC}\n" "$1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
}

################################################################################
# PRÉREQUIS
################################################################################

print_header "VÉRIFICATION DES PRÉREQUIS"

command -v docker >/dev/null 2>&1 || {
    print_error "Docker n'est pas installé"
    exit 1
}
print_success "Docker est installé"

command -v docker-compose >/dev/null 2>&1 || {
    print_error "Docker Compose n'est pas installé"
    exit 1
}
print_success "Docker Compose est installé"

docker info >/dev/null 2>&1 || {
    print_error "Docker n'est pas démarré"
    exit 1
}
print_success "Docker est actif"

################################################################################
# NETTOYAGE
################################################################################

print_header "NETTOYAGE DES CONTAINERS"

print_info "Arrêt des containers existants..."
docker-compose down >/dev/null 2>&1 || true
print_success "Containers arrêtés"

read -p "Voulez-vous réinitialiser la base de données ? (o/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[OoYy]$ ]]; then
    print_warning "Suppression des volumes Docker..."
    docker-compose down -v >/dev/null 2>&1 || true
    print_success "Volumes supprimés"
fi

################################################################################
# POSTGRESQL
################################################################################

print_header "DÉMARRAGE DE POSTGRESQL"

print_info "Lancement de PostgreSQL..."
docker-compose up -d postgres

print_info "Attente du démarrage de PostgreSQL (30s max)..."
COUNTER=0
MAX_ATTEMPTS=30

until docker exec postgres_postgis pg_isready -U admin -d projet-cloud-db >/dev/null 2>&1 \
   || [ $COUNTER -ge $MAX_ATTEMPTS ]; do
    printf "."
    sleep 1
    COUNTER=$((COUNTER+1))
done
echo ""

if [ $COUNTER -ge $MAX_ATTEMPTS ]; then
    print_error "PostgreSQL n'a pas démarré"
    docker logs postgres_postgis
    exit 1
fi

print_success "PostgreSQL prêt"

################################################################################
# BASE DE DONNÉES
################################################################################

print_header "INITIALISATION DE LA BASE DE DONNÉES"

TABLE_EXISTS=$(docker exec postgres_postgis psql -U admin -d projet-cloud-db -tAc \
"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name='utilisateur');" \
2>/dev/null || echo "f")

EXECUTE_SQL=false

if [ "$TABLE_EXISTS" = "t" ]; then
    print_warning "Base déjà initialisée"
    read -p "Réexécuter les scripts SQL ? (o/N) " -n 1 -r
    echo
    [[ $REPLY =~ ^[OoYy]$ ]] && EXECUTE_SQL=true
else
    print_info "Première initialisation détectée"
    EXECUTE_SQL=true
fi

if [ "$EXECUTE_SQL" = true ]; then
    print_info "Exécution base-finale.sql"
    docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < base/base-finale.sql

    print_info "Exécution data-finale.sql"
    docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < base/data-finale.sql

    print_success "Base de données initialisée"
fi

TABLE_COUNT=$(docker exec postgres_postgis psql -U admin -d projet-cloud-db -tAc \
"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
print_success "$TABLE_COUNT tables présentes"

################################################################################
# BACKEND
################################################################################

print_header "DÉMARRAGE DU BACKEND SPRING BOOT"

docker-compose up -d --build backend
print_info "Attente du backend (60s max)..."

COUNTER=0
MAX_ATTEMPTS=60

until curl -s http://localhost:8081/actuator/health >/dev/null 2>&1 \
   || [ $COUNTER -ge $MAX_ATTEMPTS ]; do
    sleep 1
    COUNTER=$((COUNTER+1))

    if [ $COUNTER -gt 10 ]; then
        STATUS=$(docker inspect -f '{{.State.Status}}' spring_backend 2>/dev/null || echo "dead")
        [ "$STATUS" != "running" ] && {
            print_error "Le backend a crashé"
            docker logs spring_backend --tail 50
            exit 1
        }
    fi
done

[ $COUNTER -ge $MAX_ATTEMPTS ] \
    && print_warning "Backend lent à démarrer" \
    || print_success "Backend démarré"

################################################################################
# FRONTEND
################################################################################

print_header "DÉMARRAGE DU FRONTEND REACT"

docker-compose up -d --build frontend
sleep 5
print_success "Frontend démarré"

################################################################################
# TILESERVER
################################################################################

print_header "DÉMARRAGE DU TILESERVER"

docker-compose up -d tileserver
sleep 3
print_success "TileServer démarré"

################################################################################
# STATUT FINAL
################################################################################

print_header "🚀 PROJET DÉMARRÉ AVEC SUCCÈS !"

echo ""
echo "🌐 Frontend     : http://localhost:3000"
echo "🔧 Backend API  : http://localhost:8081"
echo "📘 Swagger     : http://localhost:8081/swagger-ui.html"
echo "🗺️  TileServer  : http://localhost:8000"
echo "🐘 PostgreSQL  : localhost:5433 (admin/admin)"
echo ""
echo "✨ Bon développement ! ✨"
echo ""
