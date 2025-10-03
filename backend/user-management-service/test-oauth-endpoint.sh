#!/bin/bash

# Test script for OAuth2 get-config endpoint

echo "Testing OAuth2 get-config endpoint..."

# Test the new endpoint
echo "1. Testing /api/v1/user-management-service/v1/oauth2/get-config"
curl -X GET "http://localhost:8001/api/v1/user-management-service/v1/oauth2/get-config" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo -e "\n2. Testing with verbose output:"
curl -X GET "http://localhost:8001/api/v1/user-management-service/v1/oauth2/get-config" \
  -H "Content-Type: application/json" \
  -v

echo -e "\n\nTest completed!"
