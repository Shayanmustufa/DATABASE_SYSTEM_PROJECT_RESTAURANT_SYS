# backend/api/staff_auth_views.py (NEW FILE)

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
from .models import Staff
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_login(request):
    """
    Staff login endpoint
    Expects: {email, password}
    Returns: {access_token, refresh_token, staff_data}
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find staff by email
        staff = Staff.objects.get(Email=email)
        
        # Verify password
        if not check_password(password, staff.Password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Create JWT tokens
        refresh = RefreshToken()
        refresh['staff_id'] = staff.StaffID
        refresh['user_type'] = 'staff'
        
        return Response({
            'success': True,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'staff': {
                'staffId': staff.StaffID,
                'name': staff.Name,
                'email': staff.Email,
                'role': staff.Role,
            }
        }, status=status.HTTP_200_OK)
        
    except Staff.DoesNotExist:
        return Response(
            {'error': 'Staff account not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_current_staff(request):
    """
    Get current logged-in staff details
    """
    try:
        # Extract staff_id from token
        staff_id = request.auth.payload.get('staff_id')
        
        if not staff_id:
            return Response(
                {'error': 'Not authenticated as staff'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        staff = Staff.objects.get(StaffID=staff_id)
        
        return Response({
            'staffId': staff.StaffID,
            'name': staff.Name,
            'email': staff.Email,
            'role': staff.Role,
        })
    except Staff.DoesNotExist:
        return Response(
            {'error': 'Staff not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )