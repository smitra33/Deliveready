# Generated by Django 3.2.12 on 2022-04-12 22:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ingredients', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pantry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ingredients', models.ManyToManyField(to='ingredients.Ingredient')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pantry', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]