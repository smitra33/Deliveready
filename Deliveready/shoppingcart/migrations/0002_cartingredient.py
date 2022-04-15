# Generated by Django 3.2.12 on 2022-04-15 07:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ingredients', '0003_alter_ingredient_quantity'),
        ('shoppingcart', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CartIngredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('ingredients', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cartingredient', to='ingredients.ingredient')),
                ('shopping_cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cartingredient', to='shoppingcart.shoppingcart')),
            ],
        ),
    ]