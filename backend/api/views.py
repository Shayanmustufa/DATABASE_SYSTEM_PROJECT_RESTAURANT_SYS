from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import (
    Customer, Branch, Staff, WorksAt, MenuItem, Order, OrderDetail, Bill,
    BillComputation, Discount, Applies, Reservation, ReservationCustomer,
    Feedback, FeedbackOrder, Supplier, FoodChallenge, ChallengeParticipation,
    Inventory, OrderCustomer, OrderStaff
)
from .serializers import (
    CustomerSerializer, BranchSerializer, StaffSerializer, WorksAtSerializer,
    MenuItemSerializer, OrderSerializer, OrderDetailSerializer, BillSerializer,
    BillComputationSerializer, DiscountSerializer, AppliesSerializer,
    ReservationSerializer, ReservationCustomerSerializer, FeedbackSerializer,
    FeedbackOrderSerializer, SupplierSerializer, FoodChallengeSerializer,
    ChallengeParticipationSerializer, InventorySerializer,
    OrderCustomerSerializer, OrderStaffSerializer
)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer


class WorksAtViewSet(viewsets.ModelViewSet):
    queryset = WorksAt.objects.all()
    serializer_class = WorksAtSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class BillComputationViewSet(viewsets.ModelViewSet):
    queryset = BillComputation.objects.all()
    serializer_class = BillComputationSerializer


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class AppliesViewSet(viewsets.ModelViewSet):
    queryset = Applies.objects.all()
    serializer_class = AppliesSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer


class ReservationCustomerViewSet(viewsets.ModelViewSet):
    queryset = ReservationCustomer.objects.all()
    serializer_class = ReservationCustomerSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer


class FeedbackOrderViewSet(viewsets.ModelViewSet):
    queryset = FeedbackOrder.objects.all()
    serializer_class = FeedbackOrderSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class FoodChallengeViewSet(viewsets.ModelViewSet):
    queryset = FoodChallenge.objects.all()
    serializer_class = FoodChallengeSerializer


class ChallengeParticipationViewSet(viewsets.ModelViewSet):
    queryset = ChallengeParticipation.objects.all()
    serializer_class = ChallengeParticipationSerializer


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer


class OrderCustomerViewSet(viewsets.ModelViewSet):
    queryset = OrderCustomer.objects.all()
    serializer_class = OrderCustomerSerializer


class OrderStaffViewSet(viewsets.ModelViewSet):
    queryset = OrderStaff.objects.all()
    serializer_class = OrderStaffSerializer
