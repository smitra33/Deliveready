from django.shortcuts import render

def pantry(request):
    return render(request, 'pantry.html')
