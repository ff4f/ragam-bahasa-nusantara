#!/bin/bash

# Test script for Ragam Bahasa Nusantara API
# This script tests the authentication endpoints

echo "🧪 Testing Ragam Bahasa Nusantara API"
echo "======================================"
echo ""

BASE_URL="http://localhost:8069"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test health endpoint
echo -e "${BLUE}1. Testing health endpoint...${NC}"
HEALTH=$(curl -s "${BASE_URL}/health")
if echo "$HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi
echo ""

# Test registration
echo -e "${BLUE}2. Testing user registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testuser@example.com",
        "password": "testpassword123",
        "name": "Test User",
        "role": "contributor"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✅ Registration successful${NC}"
    echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
else
    if echo "$REGISTER_RESPONSE" | grep -q "already exists"; then
        echo -e "${BLUE}ℹ️  User already exists (this is OK)${NC}"
    else
        echo -e "${RED}❌ Registration failed${NC}"
        echo "$REGISTER_RESPONSE"
    fi
fi
echo ""

# Test login
echo -e "${BLUE}3. Testing user login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testuser@example.com",
        "password": "testpassword123"
    }')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Login successful${NC}"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test protected endpoint
echo -e "${BLUE}4. Testing protected endpoint (Get current user)...${NC}"
USER_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/auth/me" \
    -H "Authorization: Bearer $TOKEN")

if echo "$USER_RESPONSE" | grep -q "email"; then
    echo -e "${GREEN}✅ Protected endpoint access successful${NC}"
    echo "$USER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$USER_RESPONSE"
else
    echo -e "${RED}❌ Protected endpoint access failed${NC}"
    echo "$USER_RESPONSE"
    exit 1
fi
echo ""

# Test with default accounts
echo -e "${BLUE}5. Testing default contributor account...${NC}"
CONTRIB_LOGIN=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "contributor@example.com",
        "password": "password123"
    }')

if echo "$CONTRIB_LOGIN" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Default contributor login successful${NC}"
else
    echo -e "${RED}❌ Default contributor login failed${NC}"
fi
echo ""

echo -e "${BLUE}6. Testing default validator account...${NC}"
VALIDATOR_LOGIN=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "validator@example.com",
        "password": "password123"
    }')

if echo "$VALIDATOR_LOGIN" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Default validator login successful${NC}"
else
    echo -e "${RED}❌ Default validator login failed${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}🎉 All tests completed!${NC}"
echo ""
echo "API Documentation: ${BASE_URL}/api/docs"
echo "Frontend: http://localhost:3000"
