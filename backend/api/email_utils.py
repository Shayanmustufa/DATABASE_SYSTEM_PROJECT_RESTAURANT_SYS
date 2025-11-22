# backend/api/email_utils.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_reservation_confirmation_email(reservation, customer):
    """
    Send reservation confirmation email to customer
    """
    subject = f'Reservation Confirmation - {settings.RESTAURANT_NAME}'
    
    # Create HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background-color: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .detail-box {{
                background-color: #f0f0f0;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                border-left: 4px solid #667eea;
            }}
            .detail-row {{
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #ddd;
            }}
            .detail-row:last-child {{
                border-bottom: none;
            }}
            .label {{
                font-weight: bold;
                color: #667eea;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 14px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }}
            .success-icon {{
                font-size: 50px;
                text-align: center;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍽️ {settings.RESTAURANT_NAME}</h1>
                <h2>Reservation Confirmed!</h2>
            </div>
            
            <div class="content">
                <div class="success-icon">✅</div>
                
                <p>Dear {customer.FirstName} {customer.LastName},</p>
                
                <p>Thank you for choosing {settings.RESTAURANT_NAME}! Your reservation has been confirmed.</p>
                
                <div class="detail-box">
                    <h3 style="margin-top: 0; color: #667eea;">Reservation Details</h3>
                    
                    <div class="detail-row">
                        <span class="label">Reservation ID:</span>
                        <span>#{reservation.ReservationID}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="label">Date & Time:</span>
                        <span>{reservation.ReservationDateTime.strftime('%B %d, %Y at %I:%M %p')}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="label">Number of People:</span>
                        <span>{reservation.NumPeople} guests</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="label">Table Number:</span>
                        <span>Table {reservation.TableNumber}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span style="color: #27ae60; font-weight: bold;">{reservation.Status}</span>
                    </div>
                </div>
                
                <h3 style="color: #667eea;">Important Information:</h3>
                <ul>
                    <li>Please arrive 10 minutes before your reservation time</li>
                    <li>Your table will be held for 15 minutes after reservation time</li>
                    <li>If you need to cancel or modify, please contact us at least 2 hours in advance</li>
                </ul>
                
                <h3 style="color: #667eea;">Contact Information:</h3>
                <p>
                    <strong>Address:</strong> {settings.RESTAURANT_ADDRESS}<br>
                    <strong>Phone:</strong> {settings.RESTAURANT_PHONE}<br>
                    <strong>Email:</strong> {settings.DEFAULT_FROM_EMAIL}
                </p>
                
                <p style="margin-top: 30px;">We look forward to serving you!</p>
                
                <p>Best regards,<br>
                <strong>{settings.RESTAURANT_NAME} Team</strong></p>
            </div>
            
            <div class="footer">
                <p>This is an automated email. Please do not reply to this email.</p>
                <p>&copy; 2025 {settings.RESTAURANT_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text version (fallback)
    plain_message = f"""
    Reservation Confirmation - {settings.RESTAURANT_NAME}
    
    Dear {customer.FirstName} {customer.LastName},
    
    Thank you for choosing {settings.RESTAURANT_NAME}! Your reservation has been confirmed.
    
    Reservation Details:
    - Reservation ID: #{reservation.ReservationID}
    - Date & Time: {reservation.ReservationDateTime.strftime('%B %d, %Y at %I:%M %p')}
    - Number of People: {reservation.NumPeople} guests
    - Table Number: Table {reservation.TableNumber}
    - Status: {reservation.Status}
    
    Important Information:
    - Please arrive 10 minutes before your reservation time
    - Your table will be held for 15 minutes after reservation time
    - If you need to cancel or modify, please contact us at least 2 hours in advance
    
    Contact Information:
    Address: {settings.RESTAURANT_ADDRESS}
    Phone: {settings.RESTAURANT_PHONE}
    
    We look forward to serving you!
    
    Best regards,
    {settings.RESTAURANT_NAME} Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer.Email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_reservation_cancellation_email(reservation, customer):
    """
    Send reservation cancellation email to customer
    """
    subject = f'Reservation Cancelled - {settings.RESTAURANT_NAME}'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .header {{
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background-color: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍽️ {settings.RESTAURANT_NAME}</h1>
                <h2>Reservation Cancelled</h2>
            </div>
            
            <div class="content">
                <p>Dear {customer.FirstName} {customer.LastName},</p>
                
                <p>Your reservation (ID: #{reservation.ReservationID}) for {reservation.ReservationDateTime.strftime('%B %d, %Y at %I:%M %p')} has been cancelled.</p>
                
                <p>If you did not request this cancellation or would like to make a new reservation, please contact us.</p>
                
                <p>We hope to serve you soon!</p>
                
                <p>Best regards,<br>
                <strong>{settings.RESTAURANT_NAME} Team</strong></p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 {settings.RESTAURANT_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = f"""
    Reservation Cancelled - {settings.RESTAURANT_NAME}
    
    Dear {customer.FirstName} {customer.LastName},
    
    Your reservation (ID: #{reservation.ReservationID}) for {reservation.ReservationDateTime.strftime('%B %d, %Y at %I:%M %p')} has been cancelled.
    
    If you did not request this cancellation or would like to make a new reservation, please contact us.
    
    We hope to serve you soon!
    
    Best regards,
    {settings.RESTAURANT_NAME} Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer.Email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending cancellation email: {e}")
        return False