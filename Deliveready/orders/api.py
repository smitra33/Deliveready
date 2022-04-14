from django.db.models import F
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.views import APIView
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
        total = order.values('total').first()

        # Gets subtotal and ingredients from shopping cart
        cart_id = order.values('cart').first()
        cart = ShoppingCart.objects.filter(id=cart_id['cart'])
        subtotal = cart.values('total').first()

        ingredients = cart.values('ingredients')
        ingredient_list = []

        for key in ingredients:
            ingredient_list.append(Ingredient.objects.filter(id=key['ingredients']).values('name').first())
        
        # Gets user shipping information
        user_id = cart.values('user').first()
        user = User.objects.filter(id=user_id['user'])
        address = user.values('address').first()
        first_name = user.values('first_name').first()
        last_name = user.values('last_name').first()
        phone = user.values('phone_number').first()

        data = {'number': number['order_number'],'date': date['date'],'eta': eta['eta'],'ingredients': ingredient_list, 'subtotal': subtotal['total'],'total': total['total'], 'first_name': first_name['first_name'], 'last_name': last_name['last_name'],'address': address['address'], 'phone': phone['phone_number']}
        return JsonResponse(data, safe=False)