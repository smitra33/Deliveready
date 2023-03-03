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

    # GET api call
    def get(self, request):
        user = User.objects.filter(username=request.user).first()
        cart = ShoppingCart.objects.filter(user__id=user.id).first()
        cart_ingredients = CartIngredient.objects.filter(shopping_cart_id=cart.id)

        cart_ingredient_list = [] 
        quantity_list = []
        quantity_unit_list = []
        price_list = []
        picture_list = []
        total_list = []
        total = 0

        for cart_ingredient in cart_ingredients:
            ingredient = Ingredient.objects.filter(id=cart_ingredient.ingredients_id).first()
            cart_ingredient_list.append({
                'id': ingredient.id,
                'name': ingredient.name
            })
            quantity_list.append(cart_ingredient.quantity)
            quantity_unit_list.append(ingredient.quantity_unit)
            price_list.append(ingredient.price)
            picture_list.append(ingredient.filename_url)
            price = ingredient.price
            quantity = cart_ingredient.quantity
            total_list.append(float(quantity) * float(price))
        
        for i in total_list:
            total += i
        
        data = {
            'ingredients': cart_ingredient_list,
            'quantity': quantity_list,
            'price': price_list,
            'totalPerItem' : total_list,
            'total' : total
        }
        return JsonResponse(data, safe=False)
    # def get(self, request):
    #     user = User.objects.filter(username=request.user).first()
    #     cart = ShoppingCart.objects.filter(user__id=user.id).first()
    #     cart_ingredients = CartIngredient.objects.filter(shopping_cart_id=cart.id)

    #     cart_ingredient_list = [] 
    #     quantity_list = []
    #     quantity_unit_list = []
    #     price_list = []
    #     picture_list = []
    #     total_list = []
    #     total = 0

    #     for cart_ingredient in cart_ingredients:
    #         cart_ingredient_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('name').first())
    #         print(cart_ingredient.quantity)
    #         quantity_list.append(cart_ingredient.quantity)
    #         quantity_unit_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('quantity_unit').first())
    #         price_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('price').first())
    #         picture_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('filename_url').first())
    #         price = Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('price').first()
    #         quantity = cart_ingredient.quantity
    #         total_list.append(float(quantity) * float(price['price']))
        
    #     for i in total_list:
    #         total += i
        
    #     data = {'ingredients': cart_ingredient_list, 'quantity': quantity_list, 'price': price_list, 'totalPerItem' : total_list, 'total' : total}
    #     return JsonResponse(data, safe=False)

    # POST api call
    def post (self, request, *args, **kwargs):
        try:
            ing_dict = request.data
            user = User.objects.filter(username=request.user).first()
            shopcart = ShoppingCart.objects.filter(user_id = user.id).first()
            ing_name = ing_dict['text']
            ing_quan = ing_dict['amount']
            Ingredient.objects.get(name=ing_name)
            ing_id = Ingredient.objects.filter(name=ing_name).first()
            CartIngredient.objects.get_or_create(quantity = ing_quan, ingredients_id = ing_id.id, shopping_cart_id = shopcart.id)
            return JsonResponse({'success': True, 'message': ing_id.id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    # Delete API call
    def delete (self, request, *args, **kwargs):
        try: 
            ing_dict = request.data
            user = User.objects.filter(username=request.user).first()
            shopcart = ShoppingCart.objects.filter(user_id = user.id).first()
            ing_id = ing_dict['id']
            cartIngs = CartIngredient.objects.filter(shopping_cart_id = shopcart.id, ingredients_id=ing_id).first()
            cartIngs.delete()
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})     
