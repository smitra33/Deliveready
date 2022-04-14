from django.db.models import F
from django.http import JsonResponse
from django.views.generic import UpdateView
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Recipe
from ingredients.models import Ingredient

#this is just getting the queryset for one model
class IngredientsAll(APIView):
    @action(detail=True, methods=['get'], url_path='ingredients_list', url_name='ingredients_list')
    def get(self, request, *args, **kwargs):
        ingredients = list(Ingredient.objects.all().values('name', 'quantity', 'quantity_unit', 'price'))
        return JsonResponse(ingredients, safe=False)

#this is when a model has a many to many field with another model
class IngredientsinRecipe(APIView):
    @action(detail=True, methods=['get'], url_path='ing_recipe_list', url_name='ing_recipe_list')
    def get(self, request, recipe_id):
        recipe = Recipe.objects.filter(id=recipe_id)
        ingredients = recipe.values('ingredients')
        ingredient_list = []
        for key in ingredients:
            ingredient_list.append(Ingredient.objects.filter(id=key['ingredients']).values('name').first())
        return JsonResponse(ingredient_list, safe=False)


class RecipeView(APIView):
    @action(detail=True, methods=['get'], url_path='recipe_return', url_name='recipe_return')
    def get(self, request, recipe_id):
        recipe = Recipe.objects.filter(id=recipe_id)
        name = recipe.values('title').first()
        ingredients = recipe.values('ingredients')
        ingredient_list = []
        for key in ingredients:
            ingredient_list.append(Ingredient.objects.filter(id=key['ingredients']).values('name').first())
        instructions = recipe.values('instructions').first()
        data = {'title': name['title'], 'ingredients': ingredient_list, 'instructions': instructions['instructions']}
        return JsonResponse(data, safe=False)


class AddIngredientsToCart(UpdateView):
    def post(self, request, *args, **kwargs):
        recipe = self.get_object()
