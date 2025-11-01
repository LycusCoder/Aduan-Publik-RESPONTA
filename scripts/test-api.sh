#!/bin/bash

# RESPONTA - Quick API Test Script
# Usage: bash scripts/test-api.sh

echo "=================================================="
echo "🚀 RESPONTA - Authentication API Quick Test"
echo "=================================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:8000/api/v1/login > /dev/null 2>&1; then
    echo "❌ Server is not running!"
    echo "💡 Start server with: php artisan serve"
    exit 1
fi

echo "✅ Server is running"
echo ""

# ================================
# Test 1: Register
# ================================
echo "1️⃣  REGISTER NEW USER"
echo "------------------------------------"
echo "POST /api/v1/register"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"Test User $(date +%s)\",
    \"no_hp\": \"0812$(shuf -i 10000000-99999999 -n 1)\",
    \"nik\": \"$(shuf -i 1000000000000000-9999999999999999 -n 1)\",
    \"email\": \"test$(date +%s)@example.com\",
    \"password\": \"password123\",
    \"password_confirmation\": \"password123\"
  }")

echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""
echo ""

# ================================
# Test 2: Login
# ================================
echo "2️⃣  LOGIN EXISTING USER"
echo "------------------------------------"
echo "POST /api/v1/login"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "no_hp": "081234567890",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo ""
    echo "❌ Login failed - cannot extract token"
    exit 1
fi

echo ""
echo "✅ Token extracted: ${TOKEN:0:30}..."
echo ""
echo ""

# ================================
# Test 3: Get Profile
# ================================
echo "3️⃣  GET PROFILE (Protected)"
echo "------------------------------------"
echo "GET /api/v1/profile"
echo ""

PROFILE_RESPONSE=$(curl -s -X GET http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "$PROFILE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROFILE_RESPONSE"
echo ""
echo ""

# ================================
# Test 4: Update Profile
# ================================
echo "4️⃣  UPDATE PROFILE (Protected)"
echo "------------------------------------"
echo "PUT /api/v1/profile"
echo ""

UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Updated Name Test"
  }')

echo "$UPDATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$UPDATE_RESPONSE"
echo ""
echo ""

# ================================
# Test 5: Logout
# ================================
echo "5️⃣  LOGOUT (Protected)"
echo "------------------------------------"
echo "POST /api/v1/logout"
echo ""

LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "$LOGOUT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGOUT_RESPONSE"
echo ""
echo ""

# ================================
# Test 6: Access After Logout
# ================================
echo "6️⃣  ACCESS AFTER LOGOUT (Should Fail)"
echo "------------------------------------"
echo "GET /api/v1/profile"
echo ""

AFTER_LOGOUT=$(curl -s -X GET http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "$AFTER_LOGOUT" | python3 -m json.tool 2>/dev/null || echo "$AFTER_LOGOUT"
echo ""
echo ""

# ================================
# Summary
# ================================
echo "=================================================="
echo "✅ All API tests completed!"
echo "=================================================="
echo ""
echo "📚 Available Endpoints:"
echo "  • POST   /api/v1/register"
echo "  • POST   /api/v1/verify-otp"
echo "  • POST   /api/v1/resend-otp"
echo "  • POST   /api/v1/login"
echo "  • GET    /api/v1/profile (protected)"
echo "  • PUT    /api/v1/profile (protected)"
echo "  • POST   /api/v1/logout (protected)"
echo ""
echo "📖 Documentation: docs/phase/phase-2-completion.md"
echo "🧪 Test Credentials: No HP: 081234567890 | Password: password123"
echo ""
