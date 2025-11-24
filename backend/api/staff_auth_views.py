# FILE: backend/api/staff_auth_views.py
# ✅ FIXED STAFF AUTHENTICATION

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import Staff
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_login(request):
    """
    ✅ FIXED: Staff login with proper password verification
    Expects: {email, password}
    Returns: {access_token, refresh_token, staff_data}
    """
    try:
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '').strip()
        
        # ✅ Validation
        if not email or not password:
            logger.warning(f"❌ Login attempt with missing credentials")
            return Response(
                {'error': 'Email and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logger.info(f"🔍 Attempting staff login for: {email}")
        
        # ✅ Find staff by email (case-insensitive)
        try:
            staff = Staff.objects.get(Email__iexact=email)
            logger.info(f"✅ Staff found: {staff.Name} ({staff.Email})")
        except Staff.DoesNotExist:
            logger.warning(f"❌ Staff not found: {email}")
            return Response(
                {'error': f'Staff account not found: {email}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # ✅ Verify password using Django's check_password
        if not check_password(password, staff.Password):
            logger.warning(f"❌ Invalid password for: {email}")
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        logger.info(f"✅ Password verified for: {email}")
        
        # ✅ Generate JWT tokens
        refresh = RefreshToken()
        refresh['staff_id'] = staff.StaffID
        refresh['user_type'] = 'staff'
        refresh['email'] = staff.Email
        
        logger.info(f"✅ JWT tokens generated for: {email}")
        
        response_data = {
            'success': True,
            'message': 'Staff login successful',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'staff': {
                'staffId': staff.StaffID,
                'name': staff.Name,
                'email': staff.Email,
                'role': staff.Role,
                'salary': str(staff.Salary)
            }
        }
        
        logger.info(f"✅ Login successful for: {email}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"❌ Staff login error: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Login failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_staff(request):
    """
    ✅ Get current logged-in staff details
    """
    try:
        # Extract staff_id from JWT token
        staff_id = request.auth.payload.get('staff_id') if hasattr(request, 'auth') and request.auth else None
        
        if not staff_id:
            logger.warning(f"❌ No staff_id in token")
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
            'salary': str(staff.Salary)
        })
    except Staff.DoesNotExist:
        logger.warning(f"❌ Staff not found: {staff_id}")
        return Response(
            {'error': 'Staff not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"❌ Error getting staff info: {str(e)}", exc_info=True)
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )