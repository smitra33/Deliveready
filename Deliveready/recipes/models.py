from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=80)
    id = models.IntegerField(primary_key=True)
    quantity = models.DecimalField(default=0.0, max_digits=3, decimal_places=2)


class Recipe(models.Model):
    title = models.CharField(max_length=80)
    ingredients = models.ManyToManyField(Ingredient)
    instructions = models.CharField(max_length=80)
    id = models.IntegerField(primary_key=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2)


