let title = '';
let instructions = '';
let ingredients = [];
let recipeInfo = '';
//received from view that renders recipe page under context data
//required as key to retrieve the specific recipe information
//api is called with recipe_id as soon as recipes.html is loaded
//let recipe_id = JSON.parse(document.getElementById('recipe_id').textContent);
let recipe_id = document.getElementById('recipe_id').innerHTML;

async function getRecipeInfo(){
    const response = await fetch('api/recipe_view/${recipe_id}/')
    //const response = await fetch('http://127.0.0.1:8000/api/recipe_view/1/')
    recipeInfo = await response.json();
    assignRecipeInfo();
}

function assignRecipeInfo(){
    title = recipeInfo.title;
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
