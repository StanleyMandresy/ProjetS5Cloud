#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

API_URL="http://localhost:8080"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          🧪 TESTS COMPLETS API BACKEND                        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📍 Swagger UI: ${API_URL}/swagger-ui/index.html${NC}"
echo ""

# Test 1: Health Check
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}TEST 1️⃣  : Health Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
curl -s ${API_URL}/api/auth/health | python3 -m json.tool
echo -e "\n"

# Test 2: Register (Inscription)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}TEST 2️⃣  : Register (Inscription)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Commande curl:${NC}"
echo "curl -X POST ${API_URL}/api/auth/register \\"
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"username":"alice","email":"alice@example.com","password":"securepass123"}'"'"
echo ""
REGISTER_RESPONSE=$(curl -s -X POST ${API_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"securepass123"}')
echo "$REGISTER_RESPONSE" | python3 -m json.tool
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))" 2>/dev/null)
USER_ID=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('userId', ''))" 2>/dev/null)
echo -e "\n"

# Test 3: Login (Connexion)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}TEST 3️⃣  : Login (Connexion)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Commande curl:${NC}"
echo "curl -X POST ${API_URL}/api/auth/login \\"
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"username":"alice","password":"securepass123"}'"'"
echo ""
LOGIN_RESPONSE=$(curl -s -X POST ${API_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"securepass123"}')
echo "$LOGIN_RESPONSE" | python3 -m json.tool
NEW_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))" 2>/dev/null)
echo -e "\n"

# Test 4: Get Profile (Récupérer le profil)
if [ ! -z "$USER_ID" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}TEST 4️⃣  : Get Profile (Récupérer le profil)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Commande curl:${NC}"
    echo "curl -X GET ${API_URL}/api/auth/profile/${USER_ID} \\"
    echo "  -H \"Authorization: Bearer \$TOKEN\""
    echo ""
    curl -s -X GET ${API_URL}/api/auth/profile/${USER_ID} \
      -H "Authorization: Bearer ${NEW_TOKEN:-$TOKEN}" | python3 -m json.tool
    echo -e "\n"
fi

# Test 5: Update Profile (Mettre à jour le profil)
if [ ! -z "$USER_ID" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}TEST 5️⃣  : Update Profile (Mettre à jour le profil)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Commande curl:${NC}"
    echo "curl -X PUT ${API_URL}/api/auth/profile/${USER_ID} \\"
    echo '  -H "Content-Type: application/json" \'
    echo "  -H \"Authorization: Bearer \$TOKEN\" \\"
    echo '  -d '"'"'{"username":"alice_updated","email":"alice.updated@example.com"}'"'"
    echo ""
    curl -s -X PUT ${API_URL}/api/auth/profile/${USER_ID} \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${NEW_TOKEN:-$TOKEN}" \
      -d '{"username":"alice_updated","email":"alice.updated@example.com"}' | python3 -m json.tool
    echo -e "\n"
fi

# Résumé
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    ✅ TESTS TERMINÉS                          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📚 Documentation complète:${NC}"
echo -e "   ${API_URL}/swagger-ui/index.html"
echo ""
echo -e "${YELLOW}🔐 Token JWT sauvegardé dans la variable \$TOKEN${NC}"
echo ""
