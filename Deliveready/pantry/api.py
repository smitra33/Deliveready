from django.db.models import F
from django.http import JsonResponse
from django.views.generic import UpdateView
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Pantry
from ingredients.models import Ingredient
from users.models import User
from shoppingcart.models import ShoppingCart

class PantryView(APIView):
    @action(detail=True, methods=['get'], url_path='list', url_name='list')
    def get(self, request):
        user = User.objects.filter(username=request.user).first() 
        print(request.user)
        ingredients = Pantry.objects.filter(user_id=user.id).values('ingredients')
        ingredient_list = []
        for key in ingredients:
            ingredient_list.append(Ingredient.objects.filter(id=key['ingredients']).values('name', 'quantity').first())
        data = {'ingredients': ingredient_list}
        return JsonResponse(data, safe=False)

class AddIngredientToPantry(APIView):
    @action(detail=True, methods=['post'])
    def post(self, request, *args, **kwargs):
        try:
            ing_dict = request.data
            user = User.objects.filter(username=request.user).first()
            cart = ShoppingCart.objects.filter(user__id=user.id).first()
            for key in ing_dict.items():
                ing_name = request.data['text']
                user = User.objects.filter(username=request.user).first()
                pantry = Pantry.objects.filter(user__id=user.id).first()
                created_ingredient = Ingredient.objects.create(name=ing_name, quantity=1) 
                pantry.ingredients.add(created_ingredient)
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})


class AddPantryIngredientsToCart(APIView):
    @action(detail=True, methods=['post'])
    def post(self,request, *args, **kwargs):
        try:
            pantry_id = request.data['pantry_id']
            pantry = Pantry.objects.filter(id=pantry_id)
            ingredient_list = pantry.values('ingredients')
            user = User.objects.filter(username=request.user).first()
            cart = ShoppingCart.objects.filter(user__id=user.id).first()
            for key in ingredient_list:
                single_item = Ingredient.objects.get(id=key['ingredients'])
                cart.ingredients.add(single_item)
            cart.save()
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success':False, 'message': str(e)})
            
