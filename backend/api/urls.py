from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register all viewsets
router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'branches', views.BranchViewSet, basename='branch')
router.register(r'staff', views.StaffViewSet, basename='staff')
router.register(r'works-at', views.WorksAtViewSet, basename='worksat')
router.register(r'menu-items', views.MenuItemViewSet, basename='menuitem')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'order-details', views.OrderDetailViewSet, basename='orderdetail')
router.register(r'bills', views.BillViewSet, basename='bill')
router.register(r'bill-computations', views.BillComputationViewSet, basename='billcomputation')
router.register(r'discounts', views.DiscountViewSet, basename='discount')
router.register(r'applies', views.AppliesViewSet, basename='applies')
router.register(r'reservations', views.ReservationViewSet, basename='reservation')
router.register(r'reservation-customers', views.ReservationCustomerViewSet, basename='reservationcustomer')
router.register(r'feedbacks', views.FeedbackViewSet, basename='feedback')
router.register(r'feedback-orders', views.FeedbackOrderViewSet, basename='feedbackorder')
router.register(r'suppliers', views.SupplierViewSet, basename='supplier')
router.register(r'food-challenges', views.FoodChallengeViewSet, basename='foodchallenge')
router.register(r'challenge-participations', views.ChallengeParticipationViewSet, basename='challengeparticipation')
router.register(r'inventory', views.InventoryViewSet, basename='inventory')
router.register(r'order-customers', views.OrderCustomerViewSet, basename='ordercustomer')
router.register(r'order-staff', views.OrderStaffViewSet, basename='orderstaff')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]