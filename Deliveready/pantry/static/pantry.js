let pantryInfo = {}
let ingredients = []
const addBtn = document.getElementById('addBtn');
let searchInput = document.querySelector('#searchInput');
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

// function deleteIngredient(e) {
//     const parent = e.target.parentNode;
//     const target = document.getElementById(parent.getAttribute('id') + "Card");
//     var targetIng = parent.getAttribute('id').replace("pantry","");
//     deleteIngFromPantry(targetIng);                                                         // DDELETE FUNCTION
//     target.remove();
//     parent.remove();
// }

// async function deleteIngFromPantry(targetIng) {
//     const response = await fetch(`http://127.0.0.1:8000/pantry/api/view/`, {
//         method: 'DELETE',
//         headers: {
//             'Content-type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken')
//         },
//         body: JSON.stringify({'text':targetIng})
//     });
//     const json = await response.json()
//     console.log(json['success']);
// }

function deleteIngredient(e) {
    const parent = e.target.parentNode;
    const target = document.getElementById(parent.getAttribute('id') + "Card");
    const pantryIngredientId = parent.getAttribute('data-pantry-id'); // get the id of the pantry ingredient
    deleteIngFromPantry(pantryIngredientId); // pass the id of the pantry ingredient to the deleteIngFromPantry function
    target.remove();
    parent.remove();
}

async function deleteIngFromPantry(pantryIngredientId) {
    const response = await fetch(`http://127.0.0.1:8000/pantry/api/view/${pantryIngredientId}/`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    });
    const json = await response.json()
    console.log(json['success']);
}

function addPantryCard(ingredient) {
    ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "mx-2", "mb-2");
    cardDiv.setAttribute('id', "pantry" + ingredient + "Card");

    const imgDiv = document.createElement("img");
    imgDiv.setAttribute('id', ingredient + "CardPic");
    imgDiv.classList.add("card-img", "card-img-top");
    // var image_url = ingredient.toLowerCase() +".png";
    // imgDiv.src = image_url;
    imgDiv.src = "/static/assets/" + ingredient.toLowerCase() + ".PNG"; 

    // ^^^ change to url for images later and change to JPG

    const cardBodyDiv =document.createElement("div");
    cardBodyDiv.classList.add("card-body", "card-text", "pantryCardTitle");
    cardBodyDiv.innerHTML = ingredient;

    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardBodyDiv);

    pantryImageArea.appendChild(cardDiv);
}


// //
// function addToPantry(ingredient) {
//     if (ingredient.length === null) return;
//     if (ingredient.length === 0) return;
//     console.log(isLettersOnly(ingredient));
//     if (!isLettersOnly(str)) return;


//     ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

//     var pantryItem = document.createElement('li');
//     pantryItem.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-sm");
//     pantryItem.setAttribute('id', "pantry" + ingredient);

//     const ingDiv = document.createElement("div");
//     ingDiv.classList.add("my-0", "col-6");
//     ingDiv.innerHTML = ingredient;

//     const newBtn = document.createElement("button");
//     newBtn.classList.add("btn", "btn-danger", "btn-sm");
//     newBtn.innerHTML = "x";
//     newBtn.addEventListener("click", (e) => deleteIngredient(e));

//     pantryItem.appendChild(ingDiv);
//     pantryItem.appendChild(newBtn);

//     pantryList.appendChild(pantryItem);
//     addPantryCard(ingredient);
// }

function addToPantry(ingredient) {
    if (ingredient.length === null) return;
    if (ingredient.length === 0) return;
    console.log(isLettersOnly(ingredient));
    if (!isLettersOnly(str)) return;

    ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

    var pantryItem = document.createElement('li');
    pantryItem.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-sm");
    pantryItem.setAttribute('id', "pantry" + ingredient);
    pantryItem.setAttribute('data-pantry-id', ""); // add a data attribute for the pantry ingredient id

    const ingDiv = document.createElement("div");
    ingDiv.classList.add("my-0", "col-6");
    ingDiv.innerHTML = ingredient;

    const newBtn = document.createElement("button");
    newBtn.classList.add("btn", "btn-danger", "btn-sm");
    newBtn.innerHTML = "x";
    newBtn.addEventListener("click", (e) => deleteIngredient(e));

    pantryItem.appendChild(ingDiv);
    pantryItem.appendChild(newBtn);

    pantryList.appendChild(pantryItem);
    addPantryCard(ingredient);
    addToPantryDatabase(ingredient, pantryItem); // pass the pantry item to the addToPantryDatabase function
}

// Functionality for Add button in the pantry 
// Adds the typed up ingredient to the users pantry when user clicks on the button
// function addToPantryFromButton() {
//     var ingredient = searchInput.value;
//     if (ingredient === null) return;
//     if (ingredient.length === 0) return;
//     if (document.getElementById("pantry" + ingredient.charAt(0).toUpperCase() + ingredient.slice(1)) != null) {
//         return;
//     }
//     addToPantryDatabase(ingredient);
//     addToPantry(ingredient);
// }

async function addToPantryDatabase(targetIng, pantryItem) {
    targetIng = targetIng.charAt(0).toUpperCase() + targetIng.slice(1);
    const response = await fetch(`http://127.0.0.1:8000/pantry/api/view/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: targetIng,
            quantity: pantryItem.quantity,
            unit: pantryItem.unit
        })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}


addBtn.addEventListener('click', addToPantryFromButton);

// Adds the pantry to the database -- POST api request
async function addToPantryDatabase(targetIng) {
    targetIng = targetIng.charAt(0).toUpperCase() + targetIng.slice(1);
    const response = await fetch(`http://127.0.0.1:8000/pantry/api/view/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({'text':targetIng})
    });
    const json = await response.json()
    console.log(json['success']);
}



// Cookie for pantry
function getCookie(name){
    return document.cookie.match(';?\\s*csrftoken\\s*=\\s*([^;]*)')?.pop();
}
