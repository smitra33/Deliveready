from django.db.models import F
from django.http import JsonResponse
from django.views.generic import UpdateView
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Pantry
from ingredients.models import Ingredient
from users.models import User
from shoppingcart.models import ShoppingCart


# API's for pantry page related functions
class PantryView(APIView):
    @action(detail=True, methods=['get', 'post', 'delete'], url_path='list', url_name='list')
    def get(self, request):
        user = User.objects.filter(username=request.user).first() 
        ingredients = Pantry.objects.filter(user_id=user.id).values('ingredients')
        ingredient_list = []
        for key in ingredients:
            ingredient_list.append(
                Ingredient.objects.filter(id=key['ingredients']).values('name', 'quantity', 'quantity_unit', 'price',
                                                                        'filename_url').first())
        data = {'ingredients': ingredient_list}
        return JsonResponse(data, safe=False)

    # Post API for pantry
    # Gets the user, ingredient dictionary, and pantry from request
    # Filters for requested ingredient and then adds it to the pantry
    def post(self, request, *args, **kwargs):
        try:
            ing_dict = request.data
            print(ing_dict)
            user = User.objects.filter(username=request.user).first()
            pantry = Pantry.objects.filter(user__id=user.id).first()
            for key in ing_dict.items():
                ing_name = ing_dict['text']
                desired_ingredient = Ingredient.objects.get(name=ing_name)
                pantry.ingredients.add(desired_ingredient).save()
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    # def post(self, request, *args, **kwargs):
    #     try:
    #         ing_dict = request.data
    #         user = User.objects.filter(username=request.user).first()
    #         pantry = Pantry.objects.filter(user__id=user.id).first()
    #         for key in ing_dict.items():
    #             ing_name = ing_dict['text']  
    #             if Ingredient.objects.get_or_create(name=ing_name) == False:
    #                 desired_ingredient = Ingredient.objects.filter(name=ing_name).first()
    #             else: 
    #                 desired_ingredient = Ingredient.objects.filter(name=ing_name).first()
    #             pantry.ingredients.add(desired_ingredient).save()
    #         return JsonResponse({'success': True, 'message': ''})
    #     except Exception as e:
    #         return JsonResponse({'success': False, 'message': str(e)})
        
# Delete API for pantry
# # Filters request and then searches for the desired item and deletes it
    def delete(self, request, *args, **kwargs):
        try:
            ing_dict = request.data
            user = User.objects.filter(username=request.user).first()
            pantry = Pantry.objects.filter(user__id=user.id).first()
            for key in ing_dict.items():
                ing_name = ing_dict['text']
                desired = pantry.ingredients.filter(name=ing_name).first()
                if desired:
                    pantry.ingredients.remove(desired)
            return JsonResponse({'success': True, 'message': ''})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})


# Delete API for pantry
# # Filters request and then searches for the desired item and deletes it
