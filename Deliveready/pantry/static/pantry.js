let pantryInfo = {}
let ingredients = []
const addBtn = document.getElementById('addBtn');
let searchInput = document.querySelector('#searchInput');
const pantryList = document.getElementById("pantryList");
const pantryImageArea = document.getElementById("pantryImageArea");

// Gets pantry table
async function getPantryInfo() {
    const response = await fetch (`http://127.0.0.1:8000/pantry/api/view/`)
    pantryInfo = await response.json();
    console.log(pantryInfo);
    assignPantryInfo();
}

// Assigns pantry info
function assignPantryInfo() {
    pantryInfo['ingredients'].forEach(ing => {
        ingredients.push(ing['name']);
    });
    displayElements();
}

// Displays elemnts in pantry
function displayElements() {
    for (var i = 0; i<ingredients.length; i++) {
        var targetItem = ingredients[i];
        addToPantry(targetItem);
    }
}

// Function responsible for deleting ingredient "cards"
function deleteIngredient(e) {
    const parent = e.target.parentNode;
    const target = document.getElementById(parent.getAttribute('id') + "Card");
    var targetIng = parent.getAttribute('id').replace("pantry","");
    deleteIngFromPantry(targetIng);                                                         // DDELETE FUNCTION
    target.remove();
    parent.remove();
}

// Function responsible for calling DELETE api when user removes ingredient from pantry
async function deleteIngFromPantry(targetIng) {
    const response = await fetch(`http://127.0.0.1:8000/pantry/api/view/`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({'text':targetIng})
    });
    const json = await response.json()
    console.log(json['success']);
}


// Adds pantry card to UI when user adds ingredient to pantry
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


// Adds things to the pantry card
function addToPantry(ingredient) {
    if (ingredient.length === null) return;
    if (ingredient.length === 0) return;

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
function addToPantryFromButton() {
    var ingredient = searchInput.value;
    if (ingredient === null) return;
    if (ingredient.length === 0) return;
    if (document.getElementById("pantry" + ingredient.charAt(0).toUpperCase() + ingredient.slice(1)) != null) {
        return;
    }
    addToPantryDatabase(ingredient);
    addToPantry(ingredient);
}


addBtn.addEventListener('click', function() {
    addToPantryFromButton();
    location.reload();
});

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
