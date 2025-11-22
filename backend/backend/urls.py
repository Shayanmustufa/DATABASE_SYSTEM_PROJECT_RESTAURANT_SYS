# backend/backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.auth_views import register_customer, get_current_user
from api.staff_auth_views import staff_login, get_current_staff  # ADD THIS
from api.reservation_views import (
    create_reservation,
    get_my_reservations,
    cancel_reservation,
    get_available_tables,
    get_available_time_slots
)

def home(request):
    return JsonResponse({
        'message': 'Welcome to Restaurant Management System API',
        'endpoints': {
            'customer_auth': '/api/register/, /api/token/, /api/me/',
            'staff_auth': '/api/staff/login/, /api/staff/me/',
        }
    })

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Customer Auth
    path('api/register/', register_customer, name='register'),
    path('api/me/', get_current_user, name='current_user'),
    
    # Staff Auth (ADD THIS)
    path('api/staff/login/', staff_login, name='staff_login'),
    path('api/staff/me/', get_current_staff, name='current_staff'),
    
    # Reservations
    path('api/reservations/time-slots/', get_available_time_slots, name='time_slots'),
    path('api/reservations/available-tables/', get_available_tables, name='available_tables'),
    path('api/reservations/create/', create_reservation, name='create_reservation'),
    path('api/reservations/my/', get_my_reservations, name='my_reservations'),
    path('api/reservations/<int:reservation_id>/cancel/', cancel_reservation, name='cancel_reservation'),
    
    # Generic API routes
    path('api/', include('api.urls')),
]