from django.db.models import F
from django.http import JsonResponse
from django.views.generic import UpdateView
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Recipe
from ingredients.models import Ingredient
from users.models import User
from shoppingcart.models import ShoppingCart, CartIngredient
from pantry.models import Pantry


class IngredientsAll(APIView):
    @action(detail=True, methods=['get'], url_path='ingredients_list', url_name='ingredients_list')
    def get(self, request, *args, **kwargs):
        ingredients = list(Ingredient.objects.all().values('name', 'quantity', 'quantity_unit', 'price'))
        return JsonResponse(ingredients, safe=False)


class IngredientsinRecipe(APIView):
    @action(detail=True, methods=['get'], url_path='ing_recipe_list', url_name='ing_recipe_list')
    def get(self, request, recipe_id):
        recipe = Recipe.objects.filter(id=recipe_id)
        ingredients = recipe.values('ingredients')
        ingredient_list = []
        for key in ingredients:
            ingredient_list.append(Ingredient.objects.filter(id=key['ingredients']).values('name').first())
        return JsonResponse(ingredient_list, safe=False)

#retrieves recipe information
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

#add recipe ingredients to shopping cart
# class AddRecipeIngredientsToCart(APIView):
#     @action(detail=True, methods=['post'])
#     def post(self, request, *args, **kwargs):
#         try:
#             recipe_id = request.data['recipe_id']
#             recipe = Recipe.objects.filter(id=recipe_id)
#             ingredient_list = recipe.values('ingredients')
#             user = User.objects.filter(username=request.user).first()
#             cart = ShoppingCart.objects.filter(user__id=user.id).first()
#             for key in ingredient_list:
#                 single_ing = Ingredient.objects.get(id=key['ingredients'])
#                 cart.ingredients.add(single_ing)
#             cart.save()
#             return JsonResponse({'success': True, 'message': ''})
#         except Exception as e:
#             return JsonResponse({'success': False, 'message': str(e)})

class AddRecipeIngredientsToCart(APIView):
    @action(detail=True, methods=['post'])
    def post(self, request, *args, **kwargs):
        try:
            recipe_id = request.data['recipe_id']
            recipe = Recipe.objects.filter(id=recipe_id)
            ingredient_list = recipe.values('ingredients')
            user = User.objects.filter(username=request.user).first()
            cart = ShoppingCart.objects.filter(user__id=user.id).first()
            for key in ingredient_list:
                single_ing = Ingredient.objects.get(id=key['ingredients'])
                CartIngredient.objects.create(ingredients=single_ing,shopping_cart=cart,quantity=single_ing.quantity)
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

#customer selection of ingredients after assessing duplicates added to shopping cart
#input is a dictionary: ingredient name (key) and quantity (value) for example
class AddSelectedIngredientsToCart(APIView):
    @action(detail=True, methods=['post'])
    def post(self, request, *args, **kwargs):
        try:
            ing_dict = request.data
            user = User.objects.filter(username=request.user).first()
            cart = ShoppingCart.objects.filter(user__id=user.id).first()
            for key, value in ing_dict.items():
                single_ing = Ingredient.objects.get(name=key)
                quantity = int(value)
                product = CartIngredient.objects.filter(ingredients_id=single_ing.id).filter(shopping_cart_id=cart.id).first()
                product.quantity = quantity
                product.save()
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

#retrieves ingredient quantity information in shopping cart
#output is dictionary list of ingredients, quantity, price
class CheckSelectedIngredientsToCart(APIView):
    @action(detail=True, methods=['post'])
    def post(self, request, *args, **kwargs):
        return JsonResponse(True, safe=False)

class CheckIngredientsPantry(APIView):
    @action(detail=True, methods=['get'], url_path='check_ingredients', url_name='check_ingredients')
    def get(self, request):
        try:
            user = User.objects.filter(username=request.user).first()
            cart_list = ShoppingCart.objects.filter(user__id=user.id).values('ingredients')
            pantry_list = Pantry.objects.filter(user__id=user.id).values('ingredients')
            duplicates = [elem for elem in cart_list if elem in pantry_list]
            non_duplicates = [elem for elem in cart_list if elem not in pantry_list]
            dup_list = []
            non_dup_list = []
            for dup in duplicates:
                dup_list.append(Ingredient.objects.filter(id=dup['ingredients']).values('name').first())
            for ndup in non_duplicates:
                non_dup_list.append(Ingredient.objects.filter(id=ndup['ingredients']).values('name').first())
            return JsonResponse({'success': True, 'duplicates': dup_list, 'non-dupes': non_dup_list})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})