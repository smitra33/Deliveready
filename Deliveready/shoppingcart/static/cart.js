
let ingredientsList = [];
let quantityList = [];

async function getCartInfo() {
    const response = await fetch (`http://127.0.0.1:8000/cart/api/view/`)
    cartInfo = await response.json();
    console.log(cartInfo);
    assignCartInfo();
}

function assignCartInfo() {
    cartInfo['ingredients'].forEach(ing => {
        ingredientsList.push(ing['name']);
    });
    cartInfo['quantity'].forEach(ing => {
        quantityList.push(ing['name']);
    });
    displayElements();
}

function displayElements() {
    for (var i = 0; i<ingredientsList.length; i++) {
        var item = ingredientsList[i];
        var amount = quantityList[i];
        addToPantry(item, amount);
    }
}



const addBtn = document.getElementById('cartAddBtn');
const searchInput = document.querySelector('#cartSearchInput');
const quantityInput = document.getElementById("cartQuantityInput");
const cartList = document.getElementById("cartSummaryList");
const cartCardArea = document.getElementById("cartCardArea");
const summaryPill = document.getElementById("summaryQuantityTotal");

function deleteItem(e) {
    const parent = e.target.parentNode;
    const target = document.getElementById(parent.getAttribute('id') +"Card");
    target.remove();
    parent.remove();
}

function addItemCard(item, amount) {
    item = item.charAt(0).toUpperCase() + item.slice(1);

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "mx-2", "mb-2");
    cardDiv.setAttribute('id', "cartSummary" + item + "Card");

    const imgDiv = document.createElement("img");
    imgDiv.classList.add("card-img", "card-img-top");
    imgDiv.src = "../assets/" + item.toLowerCase() + ".PNG"; 

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body", "card-text");
    
    const cardTitle = document.createElement("p");
    cardTitle.classList.add("card-text");
    cardTitle.setAttribute('id', "cartSummary" + item + "CardTitle");
    cardTitle.innerHTML = item + " x" + amount;

    const cardPricePerItem = document.createElement("p"); 
    cardPricePerItem.classList.add("card-price");
    cardPricePerItem.innerHTML = "$1.99 per item";

    const cardTotalPrice = document.createElement("p");
    cardTotalPrice.classList.add("card-price");
    cardTotalPrice.setAttribute('id', "cartSummary" + item + "CardTotal");
    cardTotalPrice.innerHTML = "Total = "

    cardBodyDiv.appendChild(cardTitle);
    cardBodyDiv.appendChild(cardPricePerItem);
    cardBodyDiv.appendChild(cardTotalPrice);

    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardBodyDiv);
    
    cartCardArea.appendChild(cardDiv);
}

function addItemSummary(item, amount) {

    if (item.length === 0) return;
    if (amount === null) amount = 1;
    if (amount <= 0) return;

    item = item.charAt(0).toUpperCase() + item.slice(1);

    if (document.getElementById("cartSummary"+item) != null) {
        document.getElementById("cartSummary" + item + "Title").innerHTML = item + " x" + amount;
        document.getElementById("cartSummary" + item + "Total").innerHTML = "PPI * " + amount + " = $99.99";
        
        document.getElementById("cartSummary" + item + "CardTitle").innerHTML = item + " x" + amount;
        document.getElementById("cartSummary" + item + "CardTotal").innerHTML = "Total = ";
        return;
    }

    const cartSummaryItem = document.createElement('li');
    cartSummaryItem.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-sm");
    cartSummaryItem.setAttribute('id', "cartSummary" + item);

    const sumDiv = document.createElement("div");

    const cartSumHeader = document.createElement("h6");
    cartSumHeader.classList.add("my-0");
    cartSumHeader.setAttribute('id', "cartSummary" + item + "Title");
    cartSumHeader.innerHTML = item + " x" + amount;

    const cartSumQuantity = document.createElement("small");
    cartSumQuantity.classList.add("text-muted");
    cartSumQuantity.setAttribute('id', "cartSummary" + item + "Total");
    cartSumQuantity.innerHTML = "PPI * " + amount + " = $99.99";

    const newBtn = document.createElement("button");
    newBtn.classList.add("btn", "btn-danger", "btn-sm");
    newBtn.innerHTML = "x";
    newBtn.addEventListener("click", (e) => deleteItem(e));


    sumDiv.appendChild(cartSumHeader);
    sumDiv.appendChild(cartSumQuantity);
    cartSummaryItem.appendChild(sumDiv);
    cartSummaryItem.appendChild(newBtn);
    cartList.appendChild(cartSummaryItem);
    addItemCard(item, amount);
}

function addItemFromButton() {
    var item = searchInput.value;
    var amount = quantityInput.value;
    addItemSummary(item, amount);
    // function to add to database
}

addBtn.addEventListener('click', addItemFromButton); 
