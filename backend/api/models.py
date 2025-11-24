from django.db import models
from django.db import models
from django.contrib.auth.hashers import make_password


# -------------------------
# 1. CUSTOMER
# -------------------------
class Customer(models.Model):
    CustomerID = models.AutoField(primary_key=True)
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    Contact = models.CharField(max_length=20)
    Email = models.CharField(max_length=100)
    LoyaltyPoints = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.FirstName} {self.LastName}"


# -------------------------
# 2. BRANCH
# -------------------------
class Branch(models.Model):
    BranchID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Location = models.CharField(max_length=200)
    Contact = models.CharField(max_length=20)

    def __str__(self):
        return self.Name


# -------------------------
# 3. STAFF
class Staff(models.Model):
    StaffID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Role = models.CharField(max_length=50)
    Salary = models.DecimalField(max_digits=10, decimal_places=2)
    Email = models.EmailField(unique=True)  # ✅ UNIQUE EMAIL
    Password = models.CharField(max_length=255)  # ✅ HASHED PASSWORD

    def set_password(self, raw_password):
        """Hash password before saving"""
        self.Password = make_password(raw_password)

    def save(self, *args, **kwargs):
        # Only hash if password is not already hashed
        if self.Password and not self.Password.startswith('pbkdf2_sha256$'):
            self.set_password(self.Password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.Name} ({self.Email})"


# -------------------------
# 4. WORKS AT (Composite Key)
# -------------------------
class WorksAt(models.Model):
    StaffID = models.ForeignKey(Staff, on_delete=models.CASCADE)
    BranchID = models.ForeignKey(Branch, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('StaffID', 'BranchID')


# -------------------------
# 5. MENU ITEM
# -------------------------
class MenuItem(models.Model):
    MenuItemID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    Category = models.CharField(max_length=50)
    Availability = models.BooleanField(default=True)

    def __str__(self):
        return self.Name


# -------------------------
# 6. ORDER
# -------------------------
class Order(models.Model):
    OrderID = models.AutoField(primary_key=True)
    OrderDate = models.DateTimeField()
    Status = models.CharField(max_length=50)

    def __str__(self):
        return f"Order {self.OrderID}"


# -------------------------
# 7. ORDER DETAIL (Composite Key)
# -------------------------
class OrderDetail(models.Model):
    OrderID = models.ForeignKey(Order, on_delete=models.CASCADE)
    MenuItemID = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    Quantity = models.IntegerField()

    class Meta:
        unique_together = ('OrderID', 'MenuItemID')


# -------------------------
# 8. BILL
# -------------------------
class Bill(models.Model):
    BillID = models.AutoField(primary_key=True)
    TotalBeforeDiscount = models.DecimalField(max_digits=10, decimal_places=2)
    DiscountAmount = models.DecimalField(max_digits=10, decimal_places=2)
    TaxAmount = models.DecimalField(max_digits=10, decimal_places=2)
    PaymentMethod = models.CharField(max_length=50)
    PaymentDate = models.DateTimeField()
    OrderID = models.ForeignKey(Order, on_delete=models.CASCADE)

    def __str__(self):
        return f"Bill {self.BillID}"


# -------------------------
# 9. BILL COMPUTATION
# -------------------------
class BillComputation(models.Model):
    BillID = models.OneToOneField(Bill, on_delete=models.CASCADE, primary_key=True)
    TotalAmount = models.DecimalField(max_digits=10, decimal_places=2)


# -------------------------
# 10. DISCOUNT
# -------------------------
class Discount(models.Model):
    DiscountID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    Description = models.TextField()
    Percentage = models.DecimalField(max_digits=5, decimal_places=2)
    StartDate = models.DateField()
    EndDate = models.DateField()

    def __str__(self):
        return self.Name


# -------------------------
# 11. APPLIES (Composite Key)
# -------------------------
class Applies(models.Model):
    BillID = models.ForeignKey(Bill, on_delete=models.CASCADE)
    DiscountID = models.ForeignKey(Discount, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('BillID', 'DiscountID')


# -------------------------
# 12. RESERVATION
# -------------------------
class Reservation(models.Model):
    ReservationID = models.AutoField(primary_key=True)
    ReservationDateTime = models.DateTimeField()
    NumPeople = models.IntegerField()
    TableNumber = models.IntegerField()
    Status = models.CharField(max_length=50)
    Confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"Reservation {self.ReservationID}"


# -------------------------
# 13. RESERVATION CUSTOMER (Composite Key)
# -------------------------
class ReservationCustomer(models.Model):
    ReservationID = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    CustomerID = models.ForeignKey(Customer, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('ReservationID', 'CustomerID')


# -------------------------
# 14. FEEDBACK
# -------------------------
class Feedback(models.Model):
    FeedbackID = models.AutoField(primary_key=True)
    Rating = models.IntegerField()
    Comment = models.TextField()
    Date = models.DateField()

    def __str__(self):
        return f"Feedback {self.FeedbackID}"


# -------------------------
# 15. FEEDBACK ORDER (Composite Key)
# -------------------------
class FeedbackOrder(models.Model):
    FeedbackID = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    OrderID = models.ForeignKey(Order, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('FeedbackID', 'OrderID')


# -------------------------
# 16. SUPPLIER
# -------------------------
class Supplier(models.Model):
    SupplierID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Contact = models.CharField(max_length=50)

    def __str__(self):
        return self.Name


# -------------------------
# 17. FOOD CHALLENGE
# -------------------------
class FoodChallenge(models.Model):
    ChallengeID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Description = models.TextField()
    Reward = models.CharField(max_length=100)
    StartDate = models.DateField()
    EndDate = models.DateField()

    def __str__(self):
        return self.Name


# -------------------------
# 18. CHALLENGE PARTICIPATION (Composite Key)
# -------------------------
class ChallengeParticipation(models.Model):
    CustomerID = models.ForeignKey(Customer, on_delete=models.CASCADE)
    ChallengeID = models.ForeignKey(FoodChallenge, on_delete=models.CASCADE)
    CompletionDate = models.DateField(null=True, blank=True)
    Status = models.CharField(max_length=50)

    class Meta:
        unique_together = ('CustomerID', 'ChallengeID')


# -------------------------
# 19. INVENTORY
# -------------------------
class Inventory(models.Model):
    ItemID = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=100)
    QuantityAvailable = models.IntegerField()
    ReorderLevel = models.IntegerField()
    SupplierID = models.ForeignKey(Supplier, on_delete=models.CASCADE)

    def __str__(self):
        return self.ItemName


# -------------------------
# 20. ORDER CUSTOMER (Composite Key)
# -------------------------
class OrderCustomer(models.Model):
    OrderID = models.ForeignKey(Order, on_delete=models.CASCADE)
    CustomerID = models.ForeignKey(Customer, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('OrderID', 'CustomerID')


# -------------------------
# 21. ORDER STAFF (Composite Key)
# -------------------------
class OrderStaff(models.Model):
    OrderID = models.ForeignKey(Order, on_delete=models.CASCADE)
    StaffID = models.ForeignKey(Staff, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('OrderID', 'StaffID')