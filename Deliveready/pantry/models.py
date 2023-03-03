from datetime import date
import datetime
from django.db import models
from orders.models import Order
from users.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from ingredients.models import Ingredient

# Model for pantry table

class Pantry(models.Model):
    ingredients = models.ManyToManyField(Ingredient)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pantry')

@receiver(post_save, sender=User)
def create_pantry(sender, instance, created, **kwargs):
    if created:
        pantry = Pantry.objects.create(user=instance)
        Order.objects.create(order_number = pantry.id, date = date.today(), eta = date.today()+datetime.timedelta(days=1), cart_id = pantry.id)
