let pantryInfo = {}
let ingredients = []
const addBtn = document.getElementById('addBtn');
let searchInput = document.querySelector('#searchInput');
// const quantityInput = document.getElementById("quantityInput");
const pantryList = document.getElementById("pantryList");
const pantryImageArea = document.getElementById("pantryImageArea");

async function getPantryInfo() {
    const response = await fetch (`http://127.0.0.1:8000/pantry/api/view/`)
    pantryInfo = await response.json();
    console.log(pantryInfo);
    assignPantryInfo();
}

function assignPantryInfo() {
    pantryInfo['ingredients'].forEach(ing => {
        ingredients.push(ing['name']);
    });
    displayElements();
}

function displayElements() {
    for (var i = 0; i<ingredients.length; i++) {
        var targetItem = ingredients[i];
        addToPantry(targetItem);
    }
}

function deleteIngredient(e) {
    const parent = e.target.parentNode;
    const target = document.getElementById(parent.getAttribute('id') + "Card");
    target.remove();
    parent.remove();
}

function addPantryCard(ingredient) {
    // var ingredient = searchInput.value;
    // var amount = quantityInput.value;
    ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "mx-2", "mb-2", "pantryCard");
    cardDiv.setAttribute('id', "pantry" + ingredient + "Card");

    const imgDiv = document.createElement("img");
    imgDiv.classList.add("card-img", "card-img-top");
    imgDiv.src = "../assets/" + ingredient.toLowerCase() + ".PNG"; 

    // ^^^ change to url for images later and change to JPG

    const cardBodyDiv =document.createElement("div");
    cardBodyDiv.classList.add("card-body", "card-text");
    cardBodyDiv.innerHTML = ingredient;
    
    // const quantitySpan = document.createElement("span");
    // quantitySpan.classList.add("center");
    // quantitySpan.setAttribute("id", "pantry" + ingredient + "CardQuantity");
    // quantitySpan.innerHTML ="Quantity = " + amount;

    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardBodyDiv);
    // cardDiv.appendChild(quantitySpan);

    pantryImageArea.appendChild(cardDiv);
}

function addToPantry(ingredient) {
    // var ingredient = searchInput.value;
    // var amount = quantityInput.value;
    if (ingredient.length === null) return;
    if (ingredient.length === 0) return;

    ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

    if (document.getElementById("pantry" + ingredient) != null) {
        return;
    }

    var pantryItem = document.createElement('li');
    pantryItem.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-sm");
    pantryItem.setAttribute('id', "pantry" + ingredient);

    const ingDiv = document.createElement("div");
    ingDiv.classList.add("my-0", "col-6");
    ingDiv.innerHTML = ingredient;

    // const spanQ = document.createElement("span");
    // spanQ.classList.add("text-muted");
    // spanQ.setAttribute("id", "pantry" + ingredient + "Quantity");
    // spanQ.innerHTML = amount;

    const newBtn = document.createElement("button");
    newBtn.classList.add("btn", "btn-danger", "btn-sm");
    newBtn.innerHTML = "x";
    newBtn.addEventListener("click", (e) => deleteIngredient(e));

    pantryItem.appendChild(ingDiv);
    // pantryItem.appendChild(spanQ);
    pantryItem.appendChild(newBtn);

    pantryList.appendChild(pantryItem);
    addPantryCard(ingredient);
}

function addToPantryFromButton() {
    var ingredient = searchInput.value;
    if (ingredient === null) return;
    if (ingredient.length === 0) return;
    // addToPantryDatabase(ingredient);
    addToPantry(ingredient);
}

addBtn.addEventListener('click', addToPantryFromButton); 

// async function addToPantryDatabase(targetIng) {
//     const response = await fetch(`http://127.0.0.1:8000/api/add_/`, {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken')
//         },
//         body: JSON.stringify({: })
//     });
//     const json = await response.json()
//     console.log(json['success']);
//     if (json['success']){
//         var header = 'Success!'
//         var text = 'Ingredients from ' + recipeInfo.title + ' added to cart!';
//         displayModalContents(header, text);
//     }
//     else {
//         var header = 'Oops!'
//         var text = 'Sorry, something went wrong, an admin will contact you shortly.';
//         displayModalContents(header, text);
//     }
// }
