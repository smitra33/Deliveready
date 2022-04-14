from django.db import models
from ingredients.models import Ingredient
from shoppingcart.models import ShoppingCart

# Create your models here.
 
class Order(models.Model):
    order_number = models.IntegerField()
    date = models.TextField()
    eta = models.TextField()
    # ingredients = models.ManyToManyField(Ingredient) # ingredients from shopping cart
    # subtotal = models.DecimalField(default=0.00, max_digits=10, decimal_places=2) # the total from shopping cart
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE) # ingredients and subtotal and user information for shipping
    total = models.DecimalField(default=0.00, max_digits=10, decimal_places=2)