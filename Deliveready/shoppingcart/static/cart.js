
let ingredientsList = [];
let quantityList = [];
let priceList = [];

async function getCartInfo() {
    const response = await fetch (`http://127.0.0.1:8000/shoppingcart/api/view/`)
    cartInfo = await response.json();
    console.log(cartInfo);
    assignCartInfo();
}

function assignCartInfo() {
    cartInfo['ingredients'].forEach(ing => {
        ingredientsList.push(ing['name']);
    });
    cartInfo['quantity'].forEach(ing => {
        quantityList.push(ing['quantity']);
    });
    cartInfo['price'].forEach(ing => {
        priceList.push(ing['price']);
    });
    displayElements();
}

function displayElements() {
    for (var i = 0; i<ingredientsList.length; i++) {
        var item = ingredientsList[i];
        var amount = quantityList[i];
        var price = priceList[i];
        if (amount <= 0) {
            amount = 1;
        }
        addItemSummary(item, amount, price);
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
    var targetIng = parent.getAttribute('id').replace("cardSummary", "");
    deleteIngFromCart(targetIng);
    target.remove();
    parent.remove();
}

async function deleteIngFromCart(targetIng, amount) {
    targetIng = targetIng.charAt(0).toUpperCase() + targetIng.slice(1);
    const response = await fetch(`http://127.0.0.1:8000/shoppingcart/api/view/`, {
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

function addItemCard(item, amount, price) {
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
    cardPricePerItem.innerHTML = "$" + price + " per item";

    const cardTotalPrice = document.createElement("p");
    cardTotalPrice.classList.add("card-price");
    cardTotalPrice.setAttribute('id', "cartSummary" + item + "CardTotal");


    cardBodyDiv.appendChild(cardTitle);
    cardBodyDiv.appendChild(cardPricePerItem);
    cardBodyDiv.appendChild(cardTotalPrice);

    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardBodyDiv);
    
    cartCardArea.appendChild(cardDiv);
}

function addItemSummary(item, amount, price) {

    if (item.length === 0) return;
    if (amount === null) amount = 1;
    if (amount <= 0) return;

    item = item.charAt(0).toUpperCase() + item.slice(1);

    if (document.getElementById("cartSummary" + item) != null) {
        var semitotal = Number(price) * Number(amount)
        document.getElementById("cartSummary" + item + "Title").innerHTML = item + " x" + amount;
        document.getElementById("cartSummary" + item + "Total").innerHTML = price + "*" + amount + "=" + semitotal;
        
        document.getElementById("cartSummary" + item + "CardTitle").innerHTML = item + " x" + amount;
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
    var semitotal = Number(price) * Number(amount)
    cartSumQuantity.innerHTML = price + "*" + amount + "=" + semitotal;

    const newBtn = document.createElement("button");
    newBtn.classList.add("btn", "btn-danger", "btn-sm");
    newBtn.innerHTML = "x";
    newBtn.addEventListener("click", (e) => deleteItem(e));


    sumDiv.appendChild(cartSumHeader);
    sumDiv.appendChild(cartSumQuantity);
    cartSummaryItem.appendChild(sumDiv);
    cartSummaryItem.appendChild(newBtn);
    cartList.appendChild(cartSummaryItem);
    addItemCard(item, amount, price);
}

function addItemFromButton() {
    var item = searchInput.value;
    var amount = quantityInput.value;
    var price = 0;
    // get price from database somehow
    // if (item === null) return;
    // if (item.length === 0) return;
    addItemSummary(item, amount, price);
    addIngredientToDatabase(item,amount);
}

addBtn.addEventListener('click', addItemFromButton); 

async function addIngredientToDatabase(targetIng, amount) {
    targetIng = targetIng.charAt(0).toUpperCase() + targetIng.slice(1);
    const response = await fetch(`http://127.0.0.1:8000/shoppingcart/api/view/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({'text':targetIng, 'amount':amount})
    });
    const json = await response.json()
    console.log(json['success']);
}


function getCookie(name){
    return document.cookie.match(';?\\s*csrftoken\\s*=\\s*([^;]*)')?.pop();
}