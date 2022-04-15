from django.conf.urls import url
from django.urls import path
from . import views, api

urlpatterns = [
    path('', views.main, name='main'),
    path('home/', views.home, name='home'),
    path('view/<int:recipe_id>/', views.recipe, name='recipe'),
    path('api/ingredients_all/', api.IngredientsAll.as_view(), name="ingredients_all"),
    path('api/ingredients_in_recipe/<int:recipe_id>/', api.IngredientsinRecipe.as_view(), name="ing_recipe_list"),
    path('api/recipe_view/<int:recipe_id>/', api.RecipeView.as_view(), name="recipe_view"),
    path('api/check_pantry_ingredients/<int:recipe_id>/', api.CheckIngredientsPantry.as_view(), name="check_pantry_ingredients"),
    path('api/check_cart_ingredients/<int:recipe_id>/', api.CheckIngredientsCart.as_view(), name="check_cart_ingredients"),
    path('api/check_empty_pantry/', api.CheckEmptyPantry.as_view(), name="check_empty_pantry"),
    path('api/add_recipe_ingredients/', api.AddRecipeIngredientsToCart.as_view(), name="add_recipe_ingredients"),
    path('api/add_select_ingredients/', api.AddSelectedIngredientsToCart.as_view(), name="add_select_ingredients"),
    path('api/check_select_ingredients/', api.CheckSelectedIngredientsToCart.as_view(), name="check_select_ingredients"),
    path('make_recipe/',views.make_recipe, name="make_recipe")
