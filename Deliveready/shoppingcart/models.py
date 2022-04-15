from django.db import models
from users.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from ingredients.models import Ingredient

class ShoppingCart(models.Model):
    ingredients = models.ManyToManyField(Ingredient)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shoppingcart')
    total = models.DecimalField(default=0.00, max_digits=10, decimal_places=2)

@receiver(post_save, sender=User)
def create_shoppingcart(sender, instance, created, **kwargs):
    if created:
        ShoppingCart.objects.create(user=instance)

class CartIngredient(models.Model):
    ingredients = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='cartingredient')
    shopping_cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, related_name='cartingredient')
    quantity = models.IntegerField(default=1)