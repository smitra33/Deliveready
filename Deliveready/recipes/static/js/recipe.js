//received from view that renders recipe page under context data
//required as key to retrieve the specific recipe information
//api is called with recipe_id as soon as recipes.html is loaded
let recipeInfo = {}

async function getRecipeInfo(){
    var id = recipe_id;
    const response = await fetch(`http://127.0.0.1:8000/api/recipe_view/${id}/`);
    recipeInfo = await response.json();
    displayRecipeInfo();
}

function displayRecipeInfo(){
    var instructions = '';
    var ingredients = [];
    recipeInfo['ingredients'].forEach(ing => {
        ingredients.push(ing['name']);
    });
    instructions = recipeInfo.instructions;
    var ingredientLength = ingredients.length;
    var ingredientList = '';
    for (var i = 0; i < ingredientLength; i++) {
        ingredientList += `<li>${ingredients[i]}</li>`
    }
    document.getElementById('recipe-ingredients').innerHTML = ingredientList;
    document.getElementById('recipe-instructions').innerHTML = instructions;
}

async function addToCart() {
    const response = await fetch(`http://127.0.0.1:8000/api/add_ingredients/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({recipe_id: recipe_id})
    });
    const json = await response.json()
    console.log(json['success']);
    if (json['success']){
        var header = 'Success!'
        var text = 'Ingredients from ' + recipeInfo.title + ' added to cart!';
        displayModalContents(header, text);
    }
    else {
        var header = 'Oops!'
        var text = 'Sorry, something went wrong, an admin will contact you shortly.';
        displayModalContents(header, text);
    }
}

function displayModalContents(header, message){
    document.getElementById("modal-heading").innerHTML = header;
    document.getElementById("modal-message").innerHTML = message;
}

function openModal (){
    $('#myModal').on('shown.bs.modal', function () {
        $('#add-button').trigger('focus')
    })
}

function getCookie(name){
    return document.cookie.match(';?\\s*csrftoken\\s*=\\s*([^;]*)')?.pop();
}