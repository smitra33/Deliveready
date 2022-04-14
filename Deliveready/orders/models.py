from django.db import models
from ingredients.models import Ingredient
from shoppingcart.models import ShoppingCart

# Create your models here.
 
class Order(models.Model):
    order_number = models.IntegerField()
    date = models.TextField()
    eta = models.TextField()
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE) # ingredients and subtotal and user information for shipping