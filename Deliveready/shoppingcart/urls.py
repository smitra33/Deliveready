from django.urls import path
from . import views, api

urlpatterns = [
    path('', views.cart, name='shoppingcart'),
    path('api/view/',api.ShoppingCartView.as_view(), name = "shoppingcart_view"),
]

