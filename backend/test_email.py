#!/usr/bin/env python
"""
Email Configuration Test Script
Run this after updating settings.py

Usage:
    python test_email.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
from django.core.mail import send_mail
from django.core import mail

def test_email_config():
    """Test email configuration step by step"""
    
    print("\n" + "="*60)
    print("📧 EMAIL CONFIGURATION TEST")
    print("="*60 + "\n")
    
    # Step 1: Check settings
    print("Step 1: Checking Email Settings...")
    print(f"   EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"   EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"   EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"   EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"   EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    
    # Check if credentials are set
    if settings.EMAIL_HOST_USER == 'your-email@gmail.com':
        print("\n❌ ERROR: You haven't updated EMAIL_HOST_USER!")
        print("   Please edit backend/backend/settings.py")
        print("   Replace 'your-email@gmail.com' with your actual Gmail")
        return False
    
    if 'xxxx' in settings.EMAIL_HOST_PASSWORD:
        print("\n❌ ERROR: You haven't updated EMAIL_HOST_PASSWORD!")
        print("   Please edit backend/backend/settings.py")
        print("   Replace with your 16-digit Gmail App Password")
        print("\n   How to get App Password:")
        print("   1. Go to https://myaccount.google.com/security")
        print("   2. Enable 2-Step Verification")
        print("   3. Go to https://myaccount.google.com/apppasswords")
        print("   4. Create app password for 'Mail'")
        print("   5. Copy the 16-digit code (remove spaces)")
        return False
    
    print("✅ Email settings configured\n")
    
    # Step 2: Check restaurant settings
    print("Step 2: Checking Restaurant Settings...")
    print(f"   RESTAURANT_NAME: {settings.RESTAURANT_NAME}")
    print(f"   RESTAURANT_PHONE: {settings.RESTAURANT_PHONE}")
    print(f"   RESTAURANT_ADDRESS: {settings.RESTAURANT_ADDRESS}")
    print("✅ Restaurant info configured\n")
    
    # Step 3: Test email sending
    print("Step 3: Sending Test Email...")
    print(f"   To: {settings.EMAIL_HOST_USER}")
    
    try:
        result = send_mail(
            subject='✅ Django Email Test - Success!',
            message='Congratulations! Your email configuration is working correctly.\n\nYou can now send reservation confirmations.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
        
        if result == 1:
            print("✅ Email sent successfully!")
            print(f"\n📬 Check your inbox: {settings.EMAIL_HOST_USER}")
            print("   (It may take a few minutes to arrive)")
            return True
        else:
            print("❌ Email failed to send (no exception but result=0)")
            return False
            
    except Exception as e:
        print(f"❌ Email sending failed!")
        print(f"   Error: {str(e)}")
        print("\n🔍 Common issues:")
        print("   1. Wrong email/password")
        print("   2. App password not created (must use App Password, not regular password)")
        print("   3. 2-Step Verification not enabled")
        print("   4. 'Less secure apps' - Use App Password instead!")
        print("   5. Firewall blocking port 587")
        return False

def test_html_email():
    """Test HTML email (like reservation confirmation)"""
    print("\n" + "="*60)
    print("📧 HTML EMAIL TEST")
    print("="*60 + "\n")
    
    html_message = """
    <html>
        <body style="font-family: Arial; padding: 20px;">
            <h2 style="color: #667eea;">🎉 Test HTML Email</h2>
            <p>This is a <strong>test HTML email</strong> from your Django app.</p>
            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
                <p><strong>Restaurant:</strong> {restaurant_name}</p>
                <p><strong>Location:</strong> {address}</p>
            </div>
            <p style="margin-top: 20px;">If you can see this email with formatting, your reservation emails will work! ✅</p>
        </body>
    </html>
    """.format(
        restaurant_name=settings.RESTAURANT_NAME,
        address=settings.RESTAURANT_ADDRESS
    )
    
    try:
        from django.core.mail import EmailMultiAlternatives
        
        email = EmailMultiAlternatives(
            subject='🎨 HTML Email Test',
            body='This is the plain text version.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.EMAIL_HOST_USER]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
        
        print("✅ HTML email sent successfully!")
        print(f"📬 Check your inbox: {settings.EMAIL_HOST_USER}")
        return True
        
    except Exception as e:
        print(f"❌ HTML email failed: {str(e)}")
        return False

if __name__ == '__main__':
    print("\n🚀 Starting Email Configuration Test...\n")
    
    # Test basic email
    basic_success = test_email_config()
    
    if basic_success:
        # Test HTML email
        html_success = test_html_email()
        
        if html_success:
            print("\n" + "="*60)
            print("✅ ALL TESTS PASSED!")
            print("="*60)
            print("\nYour email configuration is working perfectly!")
            print("Reservation confirmation emails will now be sent.\n")
        else:
            print("\n⚠️ Basic email works but HTML email failed")
            print("Check the error messages above\n")
    else:
        print("\n" + "="*60)
        print("❌ EMAIL CONFIGURATION INCOMPLETE")
        print("="*60)
        print("\nPlease fix the issues above and run this script again.\n")