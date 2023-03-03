# Generated by Django 3.2.12 on 2023-02-21 04:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('quantity', models.IntegerField(default=0)),
                ('quantity_unit', models.CharField(default='0000000', max_length=80, null=True)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=5, null=True)),
                ('filename_url', models.CharField(max_length=100, null=True)),
            ],
        ),
    ]
