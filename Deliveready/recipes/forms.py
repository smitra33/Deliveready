from django.forms import ModelForm
from django import forms
from .models import Recipe
from ingredients.models import Ingredient

class DisplayIngredientName(forms.ModelMultipleChoiceField):

    def label_from_instance(self,ingredient):
        return "%s" % ingredient.name


class PostRecipe(ModelForm):
    class Meta:
        model = Recipe
        fields = '__all__'
    ingredients = DisplayIngredientName(
        queryset=Ingredient.objects.all(),
    )


