from rest_framework import serializers
from .models import (
    Customer, Branch, Staff, WorksAt, MenuItem, Order, OrderDetail, Bill,
    BillComputation, Discount, Applies, Reservation, ReservationCustomer,
    Feedback, FeedbackOrder, Supplier, FoodChallenge, ChallengeParticipation,
    Inventory, OrderCustomer, OrderStaff
)

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'


class WorksAtSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorksAt
        fields = '__all__'


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = '__all__'


class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'


class BillComputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillComputation
        fields = '__all__'


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'


class AppliesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applies
        fields = '__all__'


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'


class ReservationCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationCustomer
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


class FeedbackOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackOrder
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class FoodChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodChallenge
        fields = '__all__'


class ChallengeParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeParticipation
        fields = '__all__'


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'


class OrderCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderCustomer
        fields = '__all__'


class OrderStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStaff
        fields = '__all__'
