from django.conf.urls import url
from django.urls import path
from . import views, api

urlpatterns = [
    path('', views.main, name='main'),
    path('home/', views.home, name='home'),
    path('view/<int:recipe_id>/', views.recipe, name='recipe'),
    path('api/ingredients_all/', api.IngredientsAll.as_view(), name="ingredients_all"),
    path('api/ingredients_in_recipe/<int:recipe_id>/', api.IngredientsinRecipe.as_view(), name="ingredients_all"),
    path('api/recipe_view/<int:recipe_id>/', api.RecipeView.as_view(), name="recipe_view"),
    path('api/add_ingredients/', api.AddRecipeIngredientsToCart.as_view(), name="add_ingredients")
]