let title = ''
let instructions = ''
let ingredients = {}
let recipeInfo = {}

async function getRecipeInfo(){
    // const response = await fetch('api/recipe_view/${id}/')
    const response = await fetch('http://127.0.0.1:8000/api/recipe_view/1/')
    recipeInfo = await response.json();
}

async function displayRecipeInfo(){
    getRecipeInfo();
}

