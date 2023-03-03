# Generated by Django 3.2.12 on 2023-02-21 04:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('shoppingcart', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.IntegerField()),
                ('date', models.TextField()),
                ('eta', models.TextField()),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shoppingcart.shoppingcart')),
            ],
        ),
    ]