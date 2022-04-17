from django.db.models import F
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.views import APIView

from shoppingcart.models import CartIngredient
from .models import Order
from ingredients.models import Ingredient
from shoppingcart.models import ShoppingCart
from users.models import User

class OrderView(APIView):
    @action(detail=True, methods=['get'], url_path='list', url_name='list')
    def get(self, request, order_id):

        # Gets order number, date, eta, and total
        order = Order.objects.filter(id=order_id) 
        number = order.values('order_number').first()
        date = order.values('date').first()
        eta = order.values('eta').first()

        # Gets subtotal and ingredients from shopping cart
        cart_id = order.values('cart').first() 
        cart = ShoppingCart.objects.filter(id=cart_id['cart'])
        subtotal = cart.values('total').first()

        ingredients = cart.values('ingredients')
        # product = CartIngredient.objects.filter(ingredients_id=single_ing.id).filter(shopping_cart_id=cart.id).first()
        cart_ingredients = CartIngredient.objects.filter(shopping_cart_id = cart_id['cart'])

        cart_ingredient_list = []
        quantity_list = []
        quantity_unit_list = []
        price_list = []
        picture_list = []
        price_list2 = []
        
        for cart_ingredient in cart_ingredients:
            cart_ingredient_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('name').first())
            #quantity_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('quantity').first())
            quantity_list.append(cart_ingredient.quantity)
            quantity_unit_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('quantity_unit').first())
            price_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('price').first())
            picture_list.append(Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('filename_url').first())
            price = Ingredient.objects.filter(id=cart_ingredient.ingredients_id).values('price').first()
            quantity = cart_ingredient.quantity
            price_list2.append(float(quantity)*float(price['price']))

        subtotal2 = 0
        for price in price_list2:
            subtotal2 = subtotal2 + price
        
        # Gets user shipping information
        user_id = cart.values('user').first()
        user = User.objects.filter(id=user_id['user'])
        address = user.values('address').first()
        first_name = user.values('first_name').first()
        last_name = user.values('last_name').first()
        phone = user.values('phone_number').first() 

        data = {'number': number['order_number'],'date': date['date'],'eta': eta['eta'],'ingredients': cart_ingredient_list, \
            'subtotal': subtotal2, 'first_name': first_name['first_name'], 'last_name': last_name['last_name'],\
                'address': address['address'], 'phone': phone['phone_number'],'quantity': quantity_list, 'quantity_unit': quantity_unit_list, \
                    'price': price_list, 'picture': picture_list}
        return JsonResponse(data, safe=False)

class OrdersAll(APIView):
    @action(detail=True, methods=['get'], url_path='orders_list', url_name='orders_list')
    def get(self, request, *args, **kwargs):
        orders = list(Order.objects.all().values('order_number', 'date', 'eta', 'cart'))
        return JsonResponse(orders, safe=False)