from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=80)
    quantity = models.IntegerField(default=0)
    quantity_unit = models.CharField(max_length=80, default='0000000', null=True)
    price = models.DecimalField(default=0.0, max_digits=5, decimal_places=2, null=True)
    filename_url = models.CharField(max_length=100, null=True)