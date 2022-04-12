let title = '';
let instructions = '';
let ingredients = [];
let recipeInfo = '';

async function getRecipeInfo(){
    // const response = await fetch('api/recipe_view/${id}/')
    const response = await fetch('http://127.0.0.1:8000/api/recipe_view/1/')
    recipeInfo = await response.json();
    assignRecipeInfo();
}

function assignRecipeInfo(){
    title = recipeInfo.name;
    recipeInfo['ingredients'].forEach(ing => {
        ingredients.push(ing['name']);
    });
    instructions = recipeInfo.instructions;
    displayElements();
}

function displayElements(){
    document.getElementById('recipe-title').innerHTML = title;
    var ingredientLength = ingredients.length;
    var ingredientList = '';
    for (var i = 0; i < ingredientLength; i++) {
        ingredientList += `<li>${ingredients[i]}</li>`
    }
    document.getElementById('recipe-ingredients').innerHTML = ingredientList;
    document.getElementById('recipe-instructions').innerHTML = instructions;
}
