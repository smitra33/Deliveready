from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Recipe
from django.views.generic import ListView

def main(request):
    return redirect('recipes:home')

def recipe(request, recipe_id):
    recipe = Recipe.objects.filter(id=recipe_id).first()
    if request.user.is_authenticated:
        context = {
            "recipe_id": recipe_id,
            "recipe": recipe,
        }
        return render(request, 'recipe.html', context)
    # # TODO: implement to login
    # return redirect('users:login')

def home(request):
    if request.user.is_authenticated:
        user = request.user
        queryset = Recipe.objects.all()
        context = {
            "object_list": queryset,
            "user": user
        }
        return render(request, "index.html", context)
