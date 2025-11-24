
from django.core.management.base import BaseCommand
from api.models import Staff
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Create demo staff accounts for testing'

    def handle(self, *args, **options):
        # Demo staff account
        staff_data = [
            {
                'Name': 'John Manager',
                'Email': 'staff1@example.com',
                'Password': 'password123',
                'Role': 'Manager',
                'Salary': 60000.00
            },
            {
                'Name': 'Jane Chef',
                'Email': 'staff2@example.com',
                'Password': 'password123',
                'Role': 'Chef',
                'Salary': 50000.00
            },
            {
                'Name': 'Bob Waiter',
                'Email': 'staff3@example.com',
                'Password': 'password123',
                'Role': 'Waiter',
                'Salary': 30000.00
            }
        ]

        for staff in staff_data:
            # Check if staff already exists
            if not Staff.objects.filter(Email=staff['Email']).exists():
                new_staff = Staff.objects.create(
                    Name=staff['Name'],
                    Email=staff['Email'],
                    Role=staff['Role'],
                    Salary=staff['Salary']
                )
                new_staff.set_password(staff['Password'])
                new_staff.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Created staff: {staff["Name"]} ({staff["Email"]})'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'⚠️ Staff already exists: {staff["Email"]}'
                    )
                )

        self.stdout.write(self.style.SUCCESS('✅ Staff creation complete!'))