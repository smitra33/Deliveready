from django.urls import path
from . import views, api

urlpatterns = [
    path('view/<int:order_id>/', views.order, name='order'),
    path('view/all/', views.order_list, name = "order_list"),
    path('api/view/<int:order_id>/', api.OrderView.as_view(), name="order_view"), 
    path('api/orders_all/', api.OrdersAll.as_view(), name="orders_all"),
    path('payment/', views.payment, name='payment') 
]