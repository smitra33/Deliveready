from django.db.models import F
from django.http import JsonResponse
from django.views.generic import UpdateView
from rest_framework.decorators import action
from rest_framework.views import APIView
from ingredients.models import Ingredient
from users.models import User
from .models import ShoppingCart
from .models import CartIngredient

class ShoppingCartView(APIView):
    @action(detail=True, methods=['get'], url_path='list', url_name='list')
    def get(self, request):
        user = User.objects.filter(username=request.user).first() 
        cart = ShoppingCart.objects.filter(id=user.id)
        cart_ingredients = CartIngredient.objects.filter(shopping_cart_id=user.id)

        cart_ingredient_list = [] 
        quantity_list = []
        quantity_unit_list = []
        price_list = []
        picture_list = []
        total_list = []
        total = 0

        for cart_ingredient in cart_ingredients:
            cart_ingredient_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('name').first())
            quantity_list.append(cart_ingredient.quantity)
            quantity_unit_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('quantity_unit').first())
            price_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('price').first())
            picture_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('filename_url').first())
            price = Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('price').first()
            quantity = cart_ingredient.quantity
            total_list.append(float(quantity) * float(price['price']))
        
        for i in total_list:
            total += i
        
        data = {'ingredients': cart_ingredient_list, 'quantity': quantity_list, 'price': price_list, 'totalPerItem' : total_list, 'total' : total}
        return JsonResponse(data, safe=False)

    def post (self, request, *args, **kwargs):
        try:
            ing_dict = request.data
            user = User.objects.filter(username=request.user).first()
            shopcart = ShoppingCart.objects.filter(user_id = user.id).first()
            for key in ing_dict.items():
                ing_name = ing_dict['text']
                print(ing_name)
                ing_quan = ing_dict['amount']
                print(ing_quan)
                if Ingredient.objects.get_or_create(name=ing_name) == False:
                    ing_id = Ingredient.objects.filter(name=ing_name).first()
                else: 
                    ing_id = Ingredient.objects.filter(name=ing_name).first()
                CartIngredient.objects.create(quantity = ing_quan, ingredients_id = ing_id.id, shopping_cart_id = shopcart.id)
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    def delete (self, request, *args, **kwargs):
        try: 
            ing_dict = request.data
            user = User.objects.filter(username=request.user).first()
            shopcart = ShoppingCart.objects.filter(user_id = user.id).first()
            for key in ing_dict.items():
                ing_name = ing_dict['text']
                cartIngs = CartIngredient.objects.filter(shopping_cart_id = shopcart.id).first()
                cartIngs.delete()
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})     

