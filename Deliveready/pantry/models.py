from django.db import models
from users.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from ingredients.models import Ingredient

class Pantry(models.Model):
    ingredients = models.ManyToManyField(Ingredient)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pantry')

@receiver(post_save, sender=User)
def create_pantry(sender, instance, created, **kwargs):
    if created:
        Pantry.objects.create(user=instance)