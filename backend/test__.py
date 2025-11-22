#!/usr/bin/env python
"""
Test Reservation Endpoints
Run this to verify your reservation APIs are working

Usage: python test_reservation_endpoints.py
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from api.reservation_views import get_available_time_slots, get_available_tables, get_my_reservations
from django.contrib.auth.models import User
from api.models import Customer

factory = RequestFactory()

print("\n" + "="*60)
print("🧪 TESTING RESERVATION ENDPOINTS")
print("="*60 + "\n")

# Test 1: Time Slots Endpoint
print("Test 1: Time Slots Endpoint")
print("-" * 40)
request = factory.get('/api/reservations/time-slots/?date=2025-12-01')
response = get_available_time_slots(request)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.data}")

if response.status_code == 200 and response.data.get('success'):
    print("✅ Time slots endpoint working!")
    print(f"   Available slots: {len(response.data.get('time_slots', []))}")
else:
    print("❌ Time slots endpoint failed!")
    print(f"   Error: {response.data.get('error', 'Unknown error')}")

print()

# Test 2: Available Tables Endpoint
print("Test 2: Available Tables Endpoint")
print("-" * 40)
request = factory.get('/api/reservations/available-tables/?date=2025-12-01&time=18:00')
response = get_available_tables(request)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.data}")

if response.status_code == 200 and response.data.get('success'):
    print("✅ Available tables endpoint working!")
    print(f"   Available tables: {response.data.get('available_count', 0)}")
else:
    print("❌ Available tables endpoint failed!")
    print(f"   Error: {response.data.get('error', 'Unknown error')}")

print()

# Test 3: My Reservations Endpoint (requires authenticated user)
print("Test 3: My Reservations Endpoint")
print("-" * 40)

# Check if any users exist
users = User.objects.all()
if users.exists():
    user = users.first()
    print(f"Using test user: {user.username}")
    
    request = factory.get('/api/reservations/my/')
    request.user = user
    
    response = get_my_reservations(request)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ My reservations endpoint working!")
        print(f"   Reservations found: {response.data.get('count', 0)}")
    else:
        print("⚠️ My reservations endpoint returned error")
        print(f"   Error: {response.data.get('error', 'Unknown error')}")
else:
    print("⚠️ No users found in database")
    print("   Create a user first to test this endpoint")

print("\n" + "="*60)
print("✅ ENDPOINT TESTING COMPLETE")
print("="*60 + "\n")

# Additional diagnostics
print("📊 DIAGNOSTICS:")
print("-" * 40)
from api.models import Reservation, ReservationCustomer
print(f"Total Reservations: {Reservation.objects.count()}")
print(f"Total Customers: {Customer.objects.count()}")
print(f"Total Users: {User.objects.count()}")
print()