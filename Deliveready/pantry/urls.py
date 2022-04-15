from django.urls import path
from . import views, api

urlpatterns = [
    path('', views.pantry, name='pantry'),
    # path('view/<int:pantry_id>/', views.pantry, name = "pantry"),
    path('api/view/',api.PantryView.as_view(), name = "pantry_view"),
]