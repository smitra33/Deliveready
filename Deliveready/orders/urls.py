from django.urls import path
from . import views, api

urlpatterns = [
    path('', views.order, name='order'),
    path('view/<int:order_id>', api.OrderView.as_view(), name="order_view"), 
    path('payment/', views.payment, name='payment')
]