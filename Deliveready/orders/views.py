from django.shortcuts import render
from .models import Order
from shoppingcart.models import ShoppingCart

def order(request,order_id):
    order = Order.objects.filter(id=order_id).first()
    if request.user.is_authenticated:
        context = {
            "order_id": order_id,
            "order": order,
        }
    return render(request, 'order.html',context)

def order_list(request):
    user = request.user
    queryset = Order.objects.all()
    context = {
        "object_list": queryset,
        "user": user
    }
    return render(request, "orderlist.html", context)

def payment(request):
    user = request.user
    cart = ShoppingCart.objects.filter(user=user.id).first()
    order = Order.objects.filter(cart_id=cart.id).first()
    if request.user.is_authenticated:
        context = {
            "order": order,
        }
    return render(request,'payment.html',context) 
