# backend/api/auth_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Customer
from .serializers import CustomerSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_customer(request):
    """
    Register a new customer with Django User and Customer profile
    """
    try:
        # Extract data
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        password2 = request.data.get('password2')
        first_name = request.data.get('firstName')
        last_name = request.data.get('lastName')
        contact = request.data.get('contact')

        # Validation
        if not all([username, email, password, password2, first_name, last_name, contact]):
            return Response(
                {'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != password2:
            return Response(
                {'error': 'Passwords do not match'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if username exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            return Response(
                {'error': list(e.messages)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Django User
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Create Customer profile
        customer = Customer.objects.create(
            FirstName=first_name,
            LastName=last_name,
            Email=email,
            Contact=contact,
            LoyaltyPoints=0
        )

        return Response({
            'success': True,
            'message': 'Registration successful! Please login.',
            'user': {
                'username': user.username,
                'email': user.email,
                'customerId': customer.CustomerID
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_current_user(request):
    """
    Get current logged in user details
    """
    if request.user.is_authenticated:
        try:
            # Try to get customer profile
            customer = Customer.objects.get(Email=request.user.email)
            return Response({
                'username': request.user.username,
                'email': request.user.email,
                'firstName': request.user.first_name,
                'lastName': request.user.last_name,
                'customerId': customer.CustomerID,
                'loyaltyPoints': customer.LoyaltyPoints
            })
        except Customer.DoesNotExist:
            return Response({
                'username': request.user.username,
                'email': request.user.email,
                'firstName': request.user.first_name,
                'lastName': request.user.last_name
            })
    else:
        return Response(
            {'error': 'Not authenticated'},
            status=status.HTTP_401_UNAUTHORIZED
        )