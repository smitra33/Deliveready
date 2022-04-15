from django.shortcuts import render, redirect
from django.http import HttpResponse
from ingredients.models import Ingredient
from .models import Recipe
from django.views.generic import ListView
from .forms import PostRecipe

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
    # if request.user.is_authenticated:
    user = request.user
    queryset = Recipe.objects.all()
    context = {
        "object_list": queryset,
        "user": user
    }
    return render(request, "index.html", context)
  

def make_recipe(request):
    if request.method == "POST":
        form = PostRecipe(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.save()
            form.save_m2m()
            return redirect("/make_recipe")
    else:
        form = PostRecipe()
    return render(request, "make_recipe.html", {"form": form})

