from django.shortcuts import render
from .models import Order

def order(request):
    return render(request, 'order.html')
