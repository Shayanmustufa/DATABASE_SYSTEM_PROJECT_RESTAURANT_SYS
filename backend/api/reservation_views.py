# backend/api/reservation_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Reservation, ReservationCustomer, Customer
from .serializers import ReservationSerializer
from .email_utils import send_reservation_confirmation_email, send_reservation_cancellation_email

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    """
    Create a new reservation with email confirmation
    """
    try:
        # Extract data
        reservation_datetime = request.data.get('ReservationDateTime')
        num_people = request.data.get('NumPeople')
        table_number = request.data.get('TableNumber')
        customer_id = request.data.get('CustomerID')
        
        # Validation
        if not all([reservation_datetime, num_people, table_number, customer_id]):
            return Response(
                {'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if table is available
        reservation_dt = datetime.fromisoformat(reservation_datetime.replace('Z', '+00:00'))
        
        # Check for overlapping reservations (same table, same time +/- 2 hours)
        time_window_start = reservation_dt - timedelta(hours=2)
        time_window_end = reservation_dt + timedelta(hours=2)
        
        overlapping = Reservation.objects.filter(
            TableNumber=table_number,
            ReservationDateTime__gte=time_window_start,
            ReservationDateTime__lte=time_window_end,
            Status__in=['Confirmed', 'Pending']
        ).exists()
        
        if overlapping:
            return Response(
                {'error': 'This table is not available at the selected time. Please choose another time or table.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create reservation
        reservation = Reservation.objects.create(
            ReservationDateTime=reservation_datetime,
            NumPeople=num_people,
            TableNumber=table_number,
            Status='Confirmed',
            Confirmed=True
        )
        
        # Link to customer
        ReservationCustomer.objects.create(
            ReservationID=reservation,
            CustomerID_id=customer_id
        )
        
        # Get customer for email
        customer = Customer.objects.get(CustomerID=customer_id)
        
        # Send confirmation email
        email_sent = send_reservation_confirmation_email(reservation, customer)
        
        return Response({
            'success': True,
            'message': 'Reservation created successfully!',
            'reservation': ReservationSerializer(reservation).data,
            'email_sent': email_sent
        }, status=status.HTTP_201_CREATED)
        
    except Customer.DoesNotExist:
        return Response(
            {'error': 'Customer not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_reservations(request):
    """
    Get all reservations for the current user
    """
    try:
        # Get customer ID from user
        customer = Customer.objects.get(Email=request.user.email)
        
        # Get reservation links
        reservation_links = ReservationCustomer.objects.filter(
            CustomerID=customer
        ).select_related('ReservationID')
        
        # Get reservations
        reservations = [link.ReservationID for link in reservation_links]
        
        # Serialize
        serializer = ReservationSerializer(reservations, many=True)
        
        return Response({
            'success': True,
            'reservations': serializer.data
        })
        
    except Customer.DoesNotExist:
        return Response(
            {'error': 'Customer profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, reservation_id):
    """
    Cancel a reservation and send cancellation email
    """
    try:
        # Get reservation
        reservation = Reservation.objects.get(ReservationID=reservation_id)
        
        # Get customer
        reservation_customer = ReservationCustomer.objects.get(
            ReservationID=reservation
        )
        customer = reservation_customer.CustomerID
        
        # Verify it's the user's reservation
        if customer.Email != request.user.email:
            return Response(
                {'error': 'You can only cancel your own reservations'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update status
        reservation.Status = 'Cancelled'
        reservation.Confirmed = False
        reservation.save()
        
        # Send cancellation email
        email_sent = send_reservation_cancellation_email(reservation, customer)
        
        return Response({
            'success': True,
            'message': 'Reservation cancelled successfully',
            'email_sent': email_sent
        })
        
    except Reservation.DoesNotExist:
        return Response(
            {'error': 'Reservation not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_available_tables(request):
    """
    Get available tables for a specific date/time
    """
    try:
        date_str = request.query_params.get('date')
        time_str = request.query_params.get('time')
        
        if not date_str or not time_str:
            return Response(
                {'error': 'Date and time are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse datetime
        reservation_datetime = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        
        # Time window (2 hours before and after)
        time_window_start = reservation_datetime - timedelta(hours=2)
        time_window_end = reservation_datetime + timedelta(hours=2)
        
        # Get occupied tables
        occupied_tables = Reservation.objects.filter(
            ReservationDateTime__gte=time_window_start,
            ReservationDateTime__lte=time_window_end,
            Status__in=['Confirmed', 'Pending']
        ).values_list('TableNumber', flat=True)
        
        # Total tables in restaurant (1-20)
        all_tables = list(range(1, 21))
        available_tables = [t for t in all_tables if t not in occupied_tables]
        
        return Response({
            'success': True,
            'available_tables': available_tables,
            'occupied_tables': list(occupied_tables),
            'date': date_str,
            'time': time_str
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_available_time_slots(request):
    """
    Get available time slots for a specific date
    """
    try:
        date_str = request.query_params.get('date')
        
        if not date_str:
            return Response(
                {'error': 'Date is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restaurant hours: 11:00 AM to 11:00 PM
        # Time slots every 30 minutes
        time_slots = []
        
        for hour in range(11, 23):  # 11 AM to 11 PM
            for minute in [0, 30]:
                if hour == 22 and minute == 30:  # Stop at 10:30 PM
                    break
                time_slots.append(f"{hour:02d}:{minute:02d}")
        
        return Response({
            'success': True,
            'date': date_str,
            'time_slots': time_slots,
            'restaurant_hours': {
                'open': '11:00',
                'close': '23:00'
            }
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )