//received from view that renders recipe page under context data
//required as key to retrieve the specific recipe information
//api is called with recipe_id as soon as recipes.html is loaded
let recipeInfo = {}
let pantryDuplicates = []
let pantryNonDuplicates = []
let cartDuplicates = []
let cartNonDuplicates = []

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
    checkUserStock();
}

function refreshModal() {
    document.getElementById('modal-heading').innerHTML = '';
    document.getElementById('modal-message').innerHTML = '';
    document.getElementById('modal-pantry').innerHTML = '';
    document.getElementById('modal-cart').innerHTML = '';
    document.getElementById('modal-add').innerHTML = '';
    document.getElementById('modal-confirm-button').style.display = "none";
}


async function checkFullPantry() {
    const response = await fetch(`http://127.0.0.1:8000/api/check_pantry_ingredients/${recipe_id}/`);
    var json = await response.json();
    if (json['success']) {
        pantryDuplicates = json['duplicates'];
        pantryNonDuplicates = json['non-dupes'];
    }
    if (!(pantryDuplicates === undefined || pantryDuplicates.length == 0)) {
        //open modal with duplicates with options to remove
        var pantryCheck = document.getElementById('modal-pantry');
        var pantryContents =
            `
            <div><h5>You already have the following items in your pantry! Please confirm by incrementing quantity </h5></div>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Ingredient</th>
                  <th scope="col">Quantity</th>
                </tr>
              </thead>
              <tbody>
              `;

        pantryDuplicates.forEach(dup => {
        pantryContents +=
            `<tr id="${dup.name}">
                <td>${dup.name}</td>
                <td id="${dup.name}-quantity">
                    <div class="input-group">
                      <input type="button" value="-" class="button-minus" data-field="quantity">
                      <input type="number" step="1" max="" value="0" name="quantity" class="quantity-field">
                      <input type="button" value="+" class="button-plus" data-field="quantity">
                    </div>
                </td>
             </tr>
            `;
        });
        pantryContents +=
            `
            </tbody>
            </table>
            `;
        pantryCheck.innerHTML = pantryContents;
    }
    if (pantryDuplicates.length > 0) {
        document.getElementById('modal-confirm-button').style.display = "block";
    }
}

async function checkCart() {
    const response = await fetch(`http://127.0.0.1:8000/api/check_cart_ingredients/${recipe_id}/`);
    var json = await response.json();
        if (json['success']) {
        cartDuplicates = json['duplicates'];
        cartNonDuplicates = json['non-dupes'];
    }
    if (!(cartDuplicates === undefined || cartDuplicates.length == 0)) {
        //open modal with duplicates with options to remove
        var cartCheck = document.getElementById('modal-cart');
        var cartContents =
            `
            <div><h5>You already have the following items in your cart! Please confirm by incrementing quantity </h5></div>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Ingredient</th>
                  <th scope="col">Quantity</th>
                </tr>
              </thead>
              <tbody>
              `;

        cartDuplicates.forEach(dup => {
        cartContents +=
            `<tr id="${dup.name}">
                <td>${dup.name}</td>
                <td id="${dup.name}-quantity">
                    <div class="input-group">
                      <input type="button" value="-" class="button-minus" data-field="quantity">
                      <input type="number" step="1" max="" value="0" name="quantity" class="quantity-field">
                      <input type="button" value="+" class="button-plus" data-field="quantity">
                    </div>
                </td>
             </tr>
            `;
        });
        cartContents +=
            `
            </tbody>
            </table>
            `;
        cartCheck.innerHTML = cartContents;
    }
    if (cartDuplicates.length > 0) {
        document.getElementById('modal-confirm-button').style.display = "block";
    }

    if ((pantryDuplicates.length ===0) && (cartDuplicates.length ===0)) {
        addRecipeToCart();
        refreshModal();
        console.log(((pantryDuplicates.length ===0) && (cartDuplicates.length ===0)));
    }
    else {
        var header = 'Please Confirm';
        var text = 'We need confirmation of the following:'
    }
}

function handleDuplicates(){
    if ((!pantryDuplicates.length === 0) || (!cartDuplicates.length === 0)){

    }

    var add_list = {}
    pantryNonDuplicates.forEach(pndup => {
        cartNonDuplicates.forEach(cndup => {
            if (pndup.name == cndup.name){
                add_list[cndup.name] = 1;
            }
        });
    });
    if (!Object.keys(add_list).length===0) {
        addIngredientsToCart(add_list);
    }
}

async function addIngredientsToCart(ingredients) {
    var sendList = {}
    ingredients.forEach(ing => {
        sendList[ing['name']] = 1;
    });
    const response = await fetch(`http://127.0.0.1:8000/api/add_select_ingredients/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(sendList)
    });
    const json = await response.json()
    if(json['success']){
        document.getElementById('modal-add').innerHTML = `<div> We have added ${sendList} to your cart </div>`
    }
}

async function checkUserStock() {
    const response = await fetch(`http://127.0.0.1:8000/api/check_empty_pantry/`);
    var json = await response.json();
    if (json['success'] && json['empty_pantry']) {
        checkCart();
    }
    else {
        checkFullPantry();
        checkCart();
    }
}

async function addRecipeToCart() {
    const response = await fetch(`http://127.0.0.1:8000/api/add_recipe_ingredients/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({recipe_id: recipe_id})
    });
    const json = await response.json()
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


function incrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data('field');
  var parent = $(e.target).closest('div');
  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

  if (!isNaN(currentVal)) {
    parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
  } else {
    parent.find('input[name=' + fieldName + ']').val(0);
  }
}

function decrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data('field');
  var parent = $(e.target).closest('div');
  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

  if (!isNaN(currentVal) && currentVal > 0) {
    parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
  } else {
    parent.find('input[name=' + fieldName + ']').val(0);
  }
}

$('.input-group').on('click', '.button-plus', function(e) {
  incrementValue(e);
});

$('.input-group').on('click', '.button-minus', function(e) {
  decrementValue(e);
});