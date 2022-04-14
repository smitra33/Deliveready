const addBtn = document.getElementById('addBtn');
const searchInput = document.querySelector('#searchInput');
const quantityInput = document.getElementById("quantityInput");
const pantryList = document.getElementById("pantryList");
const pantryImageArea = document.getElementById("pantryImageArea");

function deleteIngredient(e) {
    const parent = e.target.parentNode;
    const target = document.getElementById(parent.getAttribute('id') + "Card");
    target.remove();
    parent.remove();
}

function addPantryCard() {
    var ingredient = searchInput.value;
    var amount = quantityInput.value;
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
    
    const quantitySpan = document.createElement("span");
    quantitySpan.classList.add("center");
    quantitySpan.setAttribute("id", "pantry" + ingredient + "CardQuantity");
    quantitySpan.innerHTML ="Quantity = " + amount;

    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardBodyDiv);
    cardDiv.appendChild(quantitySpan);

    pantryImageArea.appendChild(cardDiv);
}


function addToPantry() {
    var ingredient = searchInput.value;
    var amount = quantityInput.value;

    if (ingredient.length === 0) return;

    ingredient = ingredient.charAt(0).toUpperCase() +ingredient.slice(1);

    if (document.getElementById("pantry" + ingredient) != null) {
        document.getElementById("pantry" + ingredient + "CardQuantity").innerHTML = "Quantity = " + amount;
        document.getElementById("pantry" + ingredient + "Quantity").innerHTML = "Quantity = " + amount;
        return;
    }

    var pantryItem = document.createElement('li');
    pantryItem.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-sm");
    pantryItem.setAttribute('id', "pantry" + ingredient);

    const ingDiv = document.createElement("div");
    ingDiv.classList.add("my-0", "col-6");
    ingDiv.innerHTML = ingredient;

    const spanQ = document.createElement("span");
    spanQ.classList.add("text-muted");
    spanQ.setAttribute("id", "pantry" + ingredient + "Quantity");
    spanQ.innerHTML = amount;

    const newBtn = document.createElement("button");
    newBtn.classList.add("btn", "btn-danger", "btn-sm");
    newBtn.innerHTML = "x";
    newBtn.addEventListener("click", (e) => deleteIngredient(e));

    pantryItem.appendChild(ingDiv);
    pantryItem.appendChild(spanQ);
    pantryItem.appendChild(newBtn);

    pantryList.appendChild(pantryItem);
    addPantryCard();
}

addBtn.addEventListener('click', addToPantry); 