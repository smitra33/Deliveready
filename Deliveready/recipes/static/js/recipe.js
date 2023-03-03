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

function getDuplicateInfo() {
    var sendList = {}
    var tempDup = {}
    if (cartDuplicates.length > 0) {
        cartDuplicates.forEach(dup => {
            tempDup[dup.name] = 1;
        });
    }
    if (pantryDuplicates.length > 0) {
    pantryDuplicates.forEach(dup => {
        var element = dup.name + '-quantity-pantry';
        var val = document.getElementById(element).value;
        if (parseInt(val) > 0) {
            if (dup.name in sendList){
                // console.log("pd", dup.name);
                sendList[dup.name] = parseInt(val) + 1;
            }
            else {
              sendList[dup.name] = parseInt(val);
            //   console.log("pd", dup.name, parseInt(val));
            }
        }
    });
    }
    console.log("testing", pantryNonDuplicates);
    console.log("cartdups", cartDuplicates);
    console.log("tempdup",tempDup);

    if (pantryNonDuplicates.length > 0) {
    pantryNonDuplicates.forEach(dup => {
        // console.log("non-dup", dup.name);
        // if (dup.name in sendList){
        //     sendList[dup.name] = parseInt(sendList[dup.name]) + 1;
        // }
        if (!(dup.name in sendList) && !(dup.name in tempDup)){
            console.log("non-dup", dup.name);
            sendList[dup.name] = 1;
        }
        else sendList[dup.name] = 0;
    });
    }
    console.log("sendList after pantrydup",sendList);
    if (cartDuplicates.length > 0) {
        cartDuplicates.forEach(dup => {
            var element = dup.name + '-quantity-cart';
            console.log(element);
            var val = document.getElementById(element).value;
            if (parseInt(val) > 0) {
                // if (dup.name in sendList) {
                //     sendList[dup.name] = parseInt(val) + parseInt(sendList[dup.name]);
                // } 
                if (!(dup.name in sendList)){
                    sendList[dup.name] = 1;
                }
                else {
                    sendList[dup.name] = parseInt(val);
                }
            }
        });
    }
    for (var key in sendList) {
        if (sendList[key] == 0) {
            // console.log("deleting", key);
            delete sendList[key];
        }
    }
    if (Object.keys(sendList).length === 0) {
        // console.log("sendlistabove",sendList);
        document.getElementById('modal-add').innerHTML = `<div style="text-align: center;"><h6>Nothing Added</h6><div id=totals></div></div>`
    } else {
        console.log("sendlistfinal",sendList);
        addIngredientsToCart(sendList);
    }
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
                    <div class="quantity buttons_added">
                        <input type="button" value="-" class="minus">
                        <input id ="${dup.name}-quantity-pantry" type="number" step="1" min="0" max="" name="quantity" value="0" title="Qty" class="input-text qty text" size="4" pattern="" inputmode="">
                        <input type="button" value="+" class="plus">
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
                <td>
                <div class="quantity buttons_added">
                    <input type="button" value="-" class="minus">
                    <input id ="${dup.name}-quantity-cart" type="number" step="1" min="0" max="" name="quantity" value="0" title="Qty" class="input-text qty text" size="4" pattern="" inputmode="">
                    <input type="button" value="+" class="plus">
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
        var text = 'We need confirmation of the following:';
        displayModalContents(header, text);
    }
}

async function addIngredientsToCart(ingredients) {
    if (!(Object.keys(ingredients).length === 0)) {
        var totals = ``;
        for (const [key, value] of Object.entries(ingredients)) {
            console.log(key, value);
            totals += `<br>${key}</br>`;
        }

    }
    else {
        totals = ingredients.name;
    }
    console.log("ingredients", ingredients);
    const response = await fetch(`http://127.0.0.1:8000/api/add_select_ingredients/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(ingredients)
        });
        const json = await response.json()
        if (json['success']) {
            refreshModal();
            document.getElementById('modal-add').innerHTML = `<div style="text-align: center;"><h6>Added to Cart:</h6><div id=totals></div></div>`
            document.getElementById('totals').innerHTML = totals;
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

function wcqib_refresh_quantity_increments() {
    jQuery("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").each(function(a, b) {
        var c = jQuery(b);
        c.addClass("buttons_added"), c.children().first().before('<input type="button" value="-" class="minus" />'), c.children().last().after('<input type="button" value="+" class="plus" />')
    })
}
String.prototype.getDecimals || (String.prototype.getDecimals = function() {
    var a = this,
        b = ("" + a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return b ? Math.max(0, (b[1] ? b[1].length : 0) - (b[2] ? +b[2] : 0)) : 0
}), jQuery(document).ready(function() {
    wcqib_refresh_quantity_increments()
}), jQuery(document).on("updated_wc_div", function() {
    wcqib_refresh_quantity_increments()
}), jQuery(document).on("click", ".plus, .minus", function() {
    var a = jQuery(this).closest(".quantity").find(".qty"),
        b = parseFloat(a.val()),
        c = parseFloat(a.attr("max")),
        d = parseFloat(a.attr("min")),
        e = a.attr("step");
    b && "" !== b && "NaN" !== b || (b = 0), "" !== c && "NaN" !== c || (c = ""), "" !== d && "NaN" !== d || (d = 0), "any" !== e && "" !== e && void 0 !== e && "NaN" !== parseFloat(e) || (e = 1), jQuery(this).is(".plus") ? c && b >= c ? a.val(c) : a.val((b + parseFloat(e)).toFixed(e.getDecimals())) : d && b <= d ? a.val(d) : b > 0 && a.val((b - parseFloat(e)).toFixed(e.getDecimals())), a.trigger("change")
});