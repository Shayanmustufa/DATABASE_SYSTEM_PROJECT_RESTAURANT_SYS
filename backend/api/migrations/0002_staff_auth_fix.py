# FILE: backend/api/migrations/0002_staff_auth_fix.py
# ✅ FIXED: Define function BEFORE using it in Migration class

from django.db import migrations, models


def populate_email_field(apps, schema_editor):
    """
    Data migration to populate Email field with generated emails
    Ensures no duplicate or null values
    """
    Staff = apps.get_model('api', 'Staff')
    
    for staff in Staff.objects.all():
        # Only update if Email is empty
        if not staff.Email or staff.Email.strip() == '':
            # Generate email from staff ID and name
            staff_id = staff.StaffID
            staff_name = staff.Name.lower().replace(' ', '_')
            generated_email = f'staff_{staff_id}_{staff_name}@restaurant.local'
            staff.Email = generated_email
            staff.save()
            print(f"✅ Updated Staff ID {staff_id}: {generated_email}")
    
    print(f"✅ Email population complete! Total staff: {Staff.objects.count()}")


def reverse_populate_email(apps, schema_editor):
    """
    Reverse function - clears Email field if needed
    """
    Staff = apps.get_model('api', 'Staff')
    Staff.objects.all().update(Email='')
    print("✅ Email field cleared (reverse migration)")


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        # Step 1: Add Email field as nullable first (no unique constraint)
        migrations.AddField(
            model_name='staff',
            name='Email',
            field=models.EmailField(max_length=254, null=True, blank=True, default=''),
        ),
        
        # Step 2: Add data migration to populate Email field
        migrations.RunPython(populate_email_field, reverse_populate_email),
        
        # Step 3: Make Email unique and non-nullable
        migrations.AlterField(
            model_name='staff',
            name='Email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        
        # Step 4: Ensure Password field exists and has proper length
        migrations.AlterField(
            model_name='staff',
            name='Password',
            field=models.CharField(max_length=255, default=''),
        ),
    ]