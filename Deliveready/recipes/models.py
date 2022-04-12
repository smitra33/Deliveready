from django.db import models
from ingredients.models import Ingredient

class Recipe(models.Model):
    title = models.CharField(max_length=80)
    ingredients = models.ManyToManyField(Ingredient)
    instructions = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2)