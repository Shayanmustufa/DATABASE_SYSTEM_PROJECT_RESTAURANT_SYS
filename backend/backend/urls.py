# backend/backend/urls.py
# COMPLETE CORRECTED FILE - COPY AND REPLACE

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.auth_views import register_customer, get_current_user
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
            'admin': '/admin/',
            'api': '/api/',
            'login': '/api/token/',
            'refresh': '/api/token/refresh/',
            'register': '/api/register/',
            'me': '/api/me/',
            'customers': '/api/customers/',
            'menu_items': '/api/menu-items/',
            'orders': '/api/orders/',
            'reservations': '/api/reservations/',
        },
        'customer_website': 'http://localhost:3000',
        'staff_dashboard': 'http://localhost:3000/staff',
    })

urlpatterns = [
    # Home endpoint
    path('', home, name='home'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Custom auth endpoints
    path('api/register/', register_customer, name='register'),
    path('api/me/', get_current_user, name='current_user'),
    
    # ⭐ RESERVATION ENDPOINTS - MUST BE BEFORE api/ include
    path('api/reservations/time-slots/', get_available_time_slots, name='time_slots'),
    path('api/reservations/available-tables/', get_available_tables, name='available_tables'),
    path('api/reservations/create/', create_reservation, name='create_reservation'),
    path('api/reservations/my/', get_my_reservations, name='my_reservations'),
    path('api/reservations/<int:reservation_id>/cancel/', cancel_reservation, name='cancel_reservation'),
    
    # ⭐ Generic API routes (AFTER custom endpoints)
    path('api/', include('api.urls')),
]