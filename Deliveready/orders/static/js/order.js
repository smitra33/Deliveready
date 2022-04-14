let order_number = '';
let date = '';
let eta = '';
let ingredients = [];
let subtotal = '';
let total = '';
let first_name = '';
let last_name = '';
let address = '';
let phone = '';

async function getOrderInfo(){
    const response = await fetch('http://127.0.0.1:8000/order/view/1')
    orderInfo = await response.json();
    assignOrderInfo();
}

function assignOrderInfo(){
    order_number = orderInfo.number;
    date = orderInfo.date;
    first_name = orderInfo.first_name;
    last_name = orderInfo.last_name;
    address = orderInfo.address;
    phone = orderInfo.phone;
    eta = orderInfo.eta;
    subtotal = orderInfo.subtotal;
    total = orderInfo.total;

    orderInfo['ingredients'].forEach(ing => {
        ingredients.push(ing['name']);
    });

    displayElements();
}

function displayElements(){
    document.getElementById("order-number").innerHTML = order_number;
    document.getElementById("date").innerHTML = date;
    document.getElementById("name").innerHTML = first_name + " " + last_name;
    document.getElementById("address").innerHTML = address;
    document.getElementById("phone").innerHTML = phone;
    document.getElementById("eta").innerHTML = eta;
    document.getElementById("subtotal").innerHTML = subtotal;
    document.getElementById("total").innerHTML = total;

    var ingredientLength = ingredients.length;
    var table = document.getElementById("ingredients-table");
    for (var i = 0; i < ingredientLength; i++) {
        row = table.insertRow(i+1);
        cell1 = row.insertCell(0); // picture
        cell2 = row.insertCell(1); // name
        cell3 = row.insertCell(2); // quantity
        cell4 = row.insertCell(3); // price
        cell2.innerHTML = ingredients[i];
    }



}