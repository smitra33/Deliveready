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
        print(request.user)
        ingredients = cartingredient.objects.filter(user_id=user.id).values('ingredients')
        ingredient_list = []
        for key in ingredients:
            ingredient_list.append(Ingredient.objects.filter(id=key['ingredients']).values('name', 'quantity','price').first())
        data = {'ingredients': ingredient_list}
        return JsonResponse(data, safe=False)