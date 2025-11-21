from django.contrib import admin
from .models import (
    Customer, Branch, Staff, WorksAt, MenuItem, Order, OrderDetail, Bill,
    BillComputation, Discount, Applies, Reservation, ReservationCustomer,
    Feedback, FeedbackOrder, Supplier, FoodChallenge, ChallengeParticipation,
    Inventory, OrderCustomer, OrderStaff
)

# Register your models here.

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('CustomerID', 'FirstName', 'LastName', 'Email', 'Contact', 'LoyaltyPoints')
    search_fields = ('FirstName', 'LastName', 'Email')
    list_filter = ('LoyaltyPoints',)


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('BranchID', 'Name', 'Location', 'Contact')
    search_fields = ('Name', 'Location')


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('StaffID', 'Name', 'Role', 'Salary')
    search_fields = ('Name', 'Role')
    list_filter = ('Role',)


@admin.register(WorksAt)
class WorksAtAdmin(admin.ModelAdmin):
    list_display = ('StaffID', 'BranchID')
    list_filter = ('BranchID',)


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('MenuItemID', 'Name', 'Price', 'Category', 'Availability')
    search_fields = ('Name', 'Category')
    list_filter = ('Category', 'Availability')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('OrderID', 'OrderDate', 'Status')
    search_fields = ('OrderID',)
    list_filter = ('Status', 'OrderDate')


@admin.register(OrderDetail)
class OrderDetailAdmin(admin.ModelAdmin):
    list_display = ('OrderID', 'MenuItemID', 'Quantity')
    list_filter = ('OrderID',)


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('BillID', 'OrderID', 'TotalBeforeDiscount', 'DiscountAmount', 'TaxAmount', 'PaymentMethod', 'PaymentDate')
    search_fields = ('BillID',)
    list_filter = ('PaymentMethod', 'PaymentDate')


@admin.register(BillComputation)
class BillComputationAdmin(admin.ModelAdmin):
    list_display = ('BillID', 'TotalAmount')


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('DiscountID', 'Name', 'Percentage', 'StartDate', 'EndDate')
    search_fields = ('Name',)
    list_filter = ('StartDate', 'EndDate')


@admin.register(Applies)
class AppliesAdmin(admin.ModelAdmin):
    list_display = ('BillID', 'DiscountID')


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('ReservationID', 'ReservationDateTime', 'NumPeople', 'TableNumber', 'Status', 'Confirmed')
    search_fields = ('ReservationID', 'TableNumber')
    list_filter = ('Status', 'Confirmed', 'ReservationDateTime')


@admin.register(ReservationCustomer)
class ReservationCustomerAdmin(admin.ModelAdmin):
    list_display = ('ReservationID', 'CustomerID')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('FeedbackID', 'Rating', 'Date')
    search_fields = ('FeedbackID',)
    list_filter = ('Rating', 'Date')


@admin.register(FeedbackOrder)
class FeedbackOrderAdmin(admin.ModelAdmin):
    list_display = ('FeedbackID', 'OrderID')


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('SupplierID', 'Name', 'Contact')
    search_fields = ('Name',)


@admin.register(FoodChallenge)
class FoodChallengeAdmin(admin.ModelAdmin):
    list_display = ('ChallengeID', 'Name', 'Reward', 'StartDate', 'EndDate')
    search_fields = ('Name',)
    list_filter = ('StartDate', 'EndDate')


@admin.register(ChallengeParticipation)
class ChallengeParticipationAdmin(admin.ModelAdmin):
    list_display = ('CustomerID', 'ChallengeID', 'CompletionDate', 'Status')
    list_filter = ('Status', 'CompletionDate')


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('ItemID', 'ItemName', 'QuantityAvailable', 'ReorderLevel', 'SupplierID')
    search_fields = ('ItemName',)
    list_filter = ('SupplierID',)


@admin.register(OrderCustomer)
class OrderCustomerAdmin(admin.ModelAdmin):
    list_display = ('OrderID', 'CustomerID')


@admin.register(OrderStaff)
class OrderStaffAdmin(admin.ModelAdmin):
    list_display = ('OrderID', 'StaffID')