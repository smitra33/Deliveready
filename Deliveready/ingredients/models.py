from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=80)
    quantity = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)
    quantity_unit = models.CharField(max_length=80, default='0000000')
    price = models.DecimalField(default=0.0, max_digits=5, decimal_places=2)
    filename_url = models.CharField(max_length=100, null=True)