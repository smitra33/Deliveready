let order_number = '';
let date = '';
let eta = '';
let ingredients = [];
let subtotal = '';
let first_name = '';
let last_name = '';
let address = '';
let phone = '';
let quantity = [];
let quantity_unit = [];
let price = [];
let picture = [];

async function getOrderInfo(){
    var id = order_id;
    const response = await fetch(`http://127.0.0.1:8000/order/api/view/${id}/`);
    //const response = await fetch('http://127.0.0.1:8000/order/api/view/1')
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

    orderInfo['ingredients'].forEach(ing => {
        ingredients.push(ing['name']);
    });

    orderInfo['quantity'].forEach(ing => {
        quantity.push(ing);
    });


     orderInfo['quantity_unit'].forEach(ing => {
         quantity_unit.push(ing['quantity_unit']);
     });

    orderInfo['price'].forEach(ing => {
        price.push(ing['price']);
    });

    orderInfo['picture'].forEach(ing => {
        picture.push(ing['filename_url']);
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

    var taxes = parseFloat(subtotal) * 0.05; // 5% GST
    document.getElementById("tax").innerHTML = taxes.toFixed(2);

    var total = parseFloat(subtotal) + taxes;
    document.getElementById("total").innerHTML = total.toFixed(2);

    var ingredientLength = ingredients.length;
    var table = document.getElementById("ingredients-table");
    for (var i = 0; i < ingredientLength; i++) {
        row = table.insertRow(i+1);
        cell1 = row.insertCell(0); // picture
        cell2 = row.insertCell(1); // name
        cell3 = row.insertCell(2); // quantity
        cell4 = row.insertCell(3); // price

   //   document.getElementById('image_place').innerHTML = '<img src = "/static/images/eggs.jpg/">'

        cell1.innerHTML = '<img src = /static/' + picture[i] + '/>';
        cell2.innerHTML = ingredients[i];
        cell3.innerHTML = quantity[i] + ' ' + quantity_unit[i];
        cell4.innerHTML = '$' + price[i];
    }



}