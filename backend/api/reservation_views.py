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
import logging
# backend/api/reservation_views.py
from django.utils import timezone
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from .models import Reservation, ReservationCustomer, Customer  # ✅ Correct models

logger = logging.getLogger(__name__)

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
                {'error': 'All fields are required: ReservationDateTime, NumPeople, TableNumber, CustomerID'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate number of people
        try:
            num_people = int(num_people)
            if num_people < 1 or num_people > 20:
                return Response(
                    {'error': 'Number of people must be between 1 and 20'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {'error': 'Invalid number of people'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate table number
        try:
            table_number = int(table_number)
            if table_number < 1 or table_number > 20:
                return Response(
                    {'error': 'Invalid table number'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {'error': 'Invalid table number'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse datetime
        try:
            if isinstance(reservation_datetime, str):
                # Handle both ISO format and custom format
                if 'T' in reservation_datetime:
                    reservation_dt = datetime.fromisoformat(reservation_datetime.replace('Z', '+00:00'))
                else:
                    reservation_dt = datetime.strptime(reservation_datetime, '%Y-%m-%d %H:%M:%S')
            else:
                reservation_dt = reservation_datetime
                
            # Make timezone aware if not already
            if timezone.is_naive(reservation_dt):
                reservation_dt = timezone.make_aware(reservation_dt)
                
        except (ValueError, TypeError) as e:
            return Response(
                {'error': f'Invalid datetime format: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if reservation is in the past
        if reservation_dt < timezone.now():
            return Response(
                {'error': 'Cannot make reservations in the past'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for overlapping reservations (same table, within 2 hours)
        time_window_start = reservation_dt - timedelta(hours=2)
        time_window_end = reservation_dt + timedelta(hours=2)
        
        overlapping = Reservation.objects.filter(
            TableNumber=table_number,
            ReservationDateTime__gte=time_window_start,
            ReservationDateTime__lte=time_window_end,
            Status__in=['Confirmed', 'Pending']
        ).exclude(Status='Cancelled').exists()
        
        if overlapping:
            return Response(
                {'error': 'This table is not available at the selected time. Please choose another time or table.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get customer
        try:
            customer = Customer.objects.get(CustomerID=customer_id)
        except Customer.DoesNotExist:
            return Response(
                {'error': 'Customer not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify the customer matches the logged-in user
        if customer.Email != request.user.email:
            return Response(
                {'error': 'You can only make reservations for yourself'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Create reservation
        reservation = Reservation.objects.create(
            ReservationDateTime=reservation_dt,
            NumPeople=num_people,
            TableNumber=table_number,
            Status='Confirmed',
            Confirmed=True
        )
        
        # Link to customer
        ReservationCustomer.objects.create(
            ReservationID=reservation,
            CustomerID=customer
        )
        
        # Send confirmation email
        email_sent = False
        try:
            email_sent = send_reservation_confirmation_email(reservation, customer)
            logger.info(f"Confirmation email sent: {email_sent}")
        except Exception as e:
            logger.error(f"Failed to send confirmation email: {str(e)}")
            # Don't fail the reservation if email fails
        
        return Response({
            'success': True,
            'message': 'Reservation created successfully!' + (' Confirmation email sent.' if email_sent else ''),
            'reservation': ReservationSerializer(reservation).data,
            'email_sent': email_sent
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error creating reservation: {str(e)}")
        return Response(
            {'error': f'Server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_reservations(request):
    """
    Get all reservations for the current user
    """
    try:
        # Get customer
        customer = Customer.objects.get(Email=request.user.email)
        
        # Get reservation links
        reservation_links = ReservationCustomer.objects.filter(
            CustomerID=customer
        ).select_related('ReservationID')
        
        # Get reservations and sort by date (newest first)
        reservations = [link.ReservationID for link in reservation_links]
        reservations.sort(key=lambda x: x.ReservationDateTime, reverse=True)
        
        # Serialize
        serializer = ReservationSerializer(reservations, many=True)
        
        return Response({
            'success': True,
            'count': len(reservations),
            'reservations': serializer.data
        })
        
    except Customer.DoesNotExist:
        return Response(
            {'error': 'Customer profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error fetching reservations: {str(e)}")
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
        
        # Get customer link
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
        
        # Check if already cancelled
        if reservation.Status == 'Cancelled':
            return Response(
                {'error': 'This reservation is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update status
        reservation.Status = 'Cancelled'
        reservation.Confirmed = False
        reservation.save()
        
        # Send cancellation email
        email_sent = False
        try:
            email_sent = send_reservation_cancellation_email(reservation, customer)
        except Exception as e:
            logger.error(f"Failed to send cancellation email: {str(e)}")
        
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
    except ReservationCustomer.DoesNotExist:
        return Response(
            {'error': 'Reservation customer link not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error cancelling reservation: {str(e)}")
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
                {'error': 'Date and time parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse datetime
        try:
            reservation_datetime = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
            if timezone.is_naive(reservation_datetime):
                reservation_datetime = timezone.make_aware(reservation_datetime)
        except ValueError as e:
            return Response(
                {'error': f'Invalid date/time format: {str(e)}. Use YYYY-MM-DD for date and HH:MM for time'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Time window (2 hours before and after)
        time_window_start = reservation_datetime - timedelta(hours=2)
        time_window_end = reservation_datetime + timedelta(hours=2)
        
        # Get occupied tables
        occupied_reservations = Reservation.objects.filter(
            ReservationDateTime__gte=time_window_start,
            ReservationDateTime__lte=time_window_end,
            Status__in=['Confirmed', 'Pending']
        ).values_list('TableNumber', flat=True)
        
        occupied_tables = list(set(occupied_reservations))
        
        # Total tables in restaurant (1-20)
        all_tables = list(range(1, 21))
        available_tables = [t for t in all_tables if t not in occupied_tables]
        
        return Response({
            'success': True,
            'date': date_str,
            'time': time_str,
            'available_tables': sorted(available_tables),
            'occupied_tables': sorted(occupied_tables),
            'total_tables': len(all_tables),
            'available_count': len(available_tables)
        })
        
    except Exception as e:
        logger.error(f"Error fetching available tables: {str(e)}")
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
                {'error': 'Date parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse date
        try:
            selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if date is in the past
        today = timezone.now().date()
        if selected_date < today:
            return Response(
                {'error': 'Cannot make reservations for past dates'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restaurant hours: 11:00 AM to 11:00 PM
        # Time slots every 30 minutes
        time_slots = []
        
        for hour in range(11, 23):  # 11 AM to 11 PM
            for minute in [0, 30]:
                if hour == 22 and minute == 30:  # Stop at 10:30 PM (last seating)
                    break
                time_slots.append(f"{hour:02d}:{minute:02d}")
        
        # If it's today, filter out past times
        if selected_date == today:
            current_time = timezone.now().time()
            current_hour = current_time.hour
            current_minute = current_time.minute
            
            available_slots = []
            for slot in time_slots:
                slot_hour, slot_minute = map(int, slot.split(':'))
                
                # Add 30 minutes buffer - can't book within 30 minutes
                if slot_hour > current_hour or (slot_hour == current_hour and slot_minute > current_minute + 30):
                    available_slots.append(slot)
            
            time_slots = available_slots
        
        return Response({
            'success': True,
            'date': date_str,
            'time_slots': time_slots,
            'restaurant_hours': {
                'open': '11:00',
                'close': '23:00',
                'last_seating': '22:30'
            }
        })
        
    except Exception as e:
        logger.error(f"Error fetching time slots: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )