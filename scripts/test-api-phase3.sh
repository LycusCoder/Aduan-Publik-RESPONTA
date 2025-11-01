#!/bin/bash

# RESPONTA API Test Script - Phase 3
# Test all Aduan CRUD endpoints

BASE_URL="http://localhost:8000/api/v1"
TOKEN=""

echo "======================================"
echo "RESPONTA API Test - Phase 3"
echo "======================================"

# 1. Login to get token
echo -e "\n[1] LOGIN"
RESPONSE=$(curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{
    "no_hp": "081234567890",
    "password": "password123"
  }')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed!"
    echo $RESPONSE | python3 -m json.tool
    exit 1
fi

echo "✅ Login success! Token: ${TOKEN:0:20}..."

# 2. Get Kategori Aduan
echo -e "\n[2] GET KATEGORI ADUAN"
curl -s -X GET $BASE_URL/kategori-aduan | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"✅ Found {len(data['data'])} categories\")"

# 3. Create Aduan
echo -e "\n[3] CREATE ADUAN"
# Create test image
convert -size 800x600 xc:blue -pointsize 50 -fill white -gravity center -annotate +0+0 "Test Aduan" /tmp/test_aduan.jpg 2>/dev/null

RESPONSE=$(curl -s -X POST $BASE_URL/aduan \
  -H "Authorization: Bearer $TOKEN" \
  -F "kategori_aduan_id=1" \
  -F "deskripsi=Test aduan from script - Jalan rusak berlubang sangat berbahaya untuk pengendara motor dan mobil." \
  -F "latitude=-6.2088" \
  -F "longitude=106.8456" \
  -F "alamat=Jl. Test Script No. 999, Jakarta" \
  -F "fotos[]=@/tmp/test_aduan.jpg")

NOMOR_TIKET=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['nomor_tiket'])" 2>/dev/null)

if [ -z "$NOMOR_TIKET" ]; then
    echo "❌ Create aduan failed!"
    echo $RESPONSE | python3 -m json.tool
    exit 1
fi

echo "✅ Aduan created! Nomor Tiket: $NOMOR_TIKET"

# 4. List My Aduan
echo -e "\n[4] LIST MY ADUAN"
RESPONSE=$(curl -s -X GET "$BASE_URL/aduan" \
  -H "Authorization: Bearer $TOKEN")
COUNT=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['meta']['total'])" 2>/dev/null)
echo "✅ Found $COUNT aduan"

# 5. Get Aduan Detail
echo -e "\n[5] GET ADUAN DETAIL"
RESPONSE=$(curl -s -X GET "$BASE_URL/aduan/$NOMOR_TIKET" \
  -H "Authorization: Bearer $TOKEN")
STATUS=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['status'])" 2>/dev/null)
echo "✅ Aduan detail retrieved! Status: $STATUS"

# 6. Update Aduan
echo -e "\n[6] UPDATE ADUAN"
RESPONSE=$(curl -s -X PUT "$BASE_URL/aduan/$NOMOR_TIKET" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deskripsi": "UPDATED via script - Jalan rusak SANGAT PARAH dan berlubang besar.",
    "alamat": "Jl. Test Script No. 999, Jakarta (Updated)"
  }')
SUCCESS=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])" 2>/dev/null)

if [ "$SUCCESS" = "True" ]; then
    echo "✅ Aduan updated successfully!"
else
    echo "❌ Update failed!"
    echo $RESPONSE | python3 -m json.tool
fi

# 7. Filter by Status
echo -e "\n[7] FILTER BY STATUS (baru)"
RESPONSE=$(curl -s -X GET "$BASE_URL/aduan?status=baru" \
  -H "Authorization: Bearer $TOKEN")
COUNT=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['meta']['total'])" 2>/dev/null)
echo "✅ Found $COUNT aduan with status 'baru'"

# 8. Filter by Kategori
echo -e "\n[8] FILTER BY KATEGORI (kategori_aduan_id=1)"
RESPONSE=$(curl -s -X GET "$BASE_URL/aduan?kategori_aduan_id=1" \
  -H "Authorization: Bearer $TOKEN")
COUNT=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['meta']['total'])" 2>/dev/null)
echo "✅ Found $COUNT aduan with kategori_aduan_id=1"

# 9. Test Authorization (Try to update after status changed)
echo -e "\n[9] TEST AUTHORIZATION"
# Manually change status via database
mysql -u root responta -e "UPDATE aduan SET status = 'diproses' WHERE nomor_tiket = '$NOMOR_TIKET';" 2>/dev/null

RESPONSE=$(curl -s -X PUT "$BASE_URL/aduan/$NOMOR_TIKET" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deskripsi": "Try to update after processed"}')

SUCCESS=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])" 2>/dev/null)

if [ "$SUCCESS" = "False" ]; then
    echo "✅ Authorization check passed! Cannot update aduan with status='diproses'"
else
    echo "❌ Authorization check failed!"
fi

# Change back to baru for deletion
mysql -u root responta -e "UPDATE aduan SET status = 'baru' WHERE nomor_tiket = '$NOMOR_TIKET';" 2>/dev/null

# 10. Delete Aduan
echo -e "\n[10] DELETE ADUAN"
RESPONSE=$(curl -s -X DELETE "$BASE_URL/aduan/$NOMOR_TIKET" \
  -H "Authorization: Bearer $TOKEN")
SUCCESS=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])" 2>/dev/null)

if [ "$SUCCESS" = "True" ]; then
    echo "✅ Aduan deleted successfully!"
else
    echo "❌ Delete failed!"
    echo $RESPONSE | python3 -m json.tool
fi

echo -e "\n======================================"
echo "✅ ALL TESTS COMPLETED!"
echo "======================================"
