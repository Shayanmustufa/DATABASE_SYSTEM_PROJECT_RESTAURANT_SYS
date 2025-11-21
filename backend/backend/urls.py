from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Simple home view
def home(request):
    return JsonResponse({
        'message': 'Welcome to Restaurant Management System API',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'login': '/api/token/',
            'refresh': '/api/token/refresh/',
            'customers': '/api/customers/',
            'menu_items': '/api/menu-items/',
            'orders': '/api/orders/',
            'reservations': '/api/reservations/',
            'staff': '/api/staff/',
            'branches': '/api/branches/',
            'inventory': '/api/inventory/',
            'bills': '/api/bills/',
            'discounts': '/api/discounts/',
            'feedback': '/api/feedbacks/',
            'suppliers': '/api/suppliers/',
            'challenges': '/api/food-challenges/',
        },
        'customer_website': 'http://localhost:3000',
        'staff_dashboard': 'http://localhost:3000/staff',
    })

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]