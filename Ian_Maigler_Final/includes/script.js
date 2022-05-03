let products = [];
let shoppingList = [];
let currencies;
let order;
let total;
let convertedPrice;
let chosenCountry;

document.addEventListener("DOMContentLoaded", function(event) { // fetch and store products

	fetch('https://fakestoreapi.com/products')
		.then(res=>res.json())
		.then(json=> {
			for(let i = 0; i < json.length; i++){
				let productObj = new Catalog(json[i]);
				products.push(productObj);
			}
			addProducts();
		});

	fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad.json') // fetches and stores up-to-date currency conversion
		.then(res=>res.json())
		.then(json=> {
			currencies = new Currencies(json);
		});
});

function getCurrency(price){ // returns price based on selected currency
	chosenCountry = document.getElementById("selectedCurrency").value;

	if(chosenCountry === 'usd'){ // convert price to usd
		convertedPrice = price * currencies.getUsDollar;
	} else if(chosenCountry === 'eur'){ // convert price to eur
		convertedPrice = price * currencies.getEuro
	} else { // nothing changes
		convertedPrice = price;
	}

	return convertedPrice.toFixed(2);
}

function emptyCart(){
	shoppingList.length = 0;
	$('#shopping-cart').empty();
	$('#orderTotal').replaceWith(`<div class="col-3 offset-6 text-center" id="orderTotal"></div>`);
	$('#cartInfo').hide();
}

function removeItem(id){// DOES NOT WORK AS INTENDED
	let listLength = shoppingList.length;
	for(let i = 0; i < listLength; i++){
		if(shoppingList[i].getProductId - 1 === id){
			shoppingList.splice(id, 1); // this logic is wrong :( didn't have time to fix it. Products id in shoppingList change as items are removed.
			$(`#itemRow${id}`).remove();
			$('#orderTotal').replaceWith(`<div class="col-3 offset-6 text-center" id="orderTotal">$${shoppingCartTotal()}</div>`);
			break;// this is bad practice but it helped the remove function work more often i dont know why...
		}
	}
	if(shoppingList.length === 0){
		$('#cartInfo').hide();
	}
}

$('#cartInfo').hide();
function addToCart(index) { // handles everything that needs to happen when an item is added to cart
	if(!containsObject(products[index], shoppingList)) {
		shoppingList.push(products[index]);
		products[index].setItemQuantity = 1;
		$('#shopping-cart').append(
			`<div class="row" id="itemRow${index}">
				<div class="col-1 text-center">
					<button class="text-center" onclick="removeItem(${index})"><i class="fa-solid fa-trash-can"></i></button>
				</div>
				<div class="col-4 text-center">${products[index].getProductTitle}</div>
				<div class="col-1 text-center" id="cartId${index}">${products[index].getItemQuantity}</div>
				<div class="col-3 text-center">$${getCurrency(products[index].getProductPrice)}</div>
				<div class="col-3 text-center" id="cartId${index}Total">$${products[index].getItemQuantity * getCurrency(products[index].getProductPrice)}</div>
			</div>`
		);
	} else {
		products[index].setItemQuantity = products[index].getItemQuantity + 1;
		$(`#cartId${index}`).replaceWith(`<div class="col-1 text-center" id="cartId${index}">${products[index].getItemQuantity}</div>`);
		$(`#cartId${index}Total`).replaceWith(`<div class="col-3 text-center" id="cartId${index}Total">$${products[index].getItemQuantity * getCurrency(products[index].getProductPrice)}</div>`);
	}
	$('#orderTotal').replaceWith(`<div class="col-3 offset-6 text-center" id="orderTotal">$${shoppingCartTotal()}</div>`);
	$('#cartInfo').show();
}

function containsObject(obj, list) { // checks to see if an object is already inside an array
	for (let i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}
	return false;
}

function shoppingCartTotal(){ // gets shopping cart subtotal
	total = 0;
	for(let i = 0; i < shoppingList.length; i++){
		total += shoppingList[i].getItemQuantity * getCurrency(shoppingList[i].getProductPrice);
	}
	return total.toFixed(2);
}

function addProducts(){ // load product as bootstrap cards from JSON file
	for(let i = 0; i < products.length; i++) {
		$('#gridItems').append(
			`<div class="col-md-4" id="item${i}">
				<div class="card">
					<img class="card-img-top" src="${products[i].getProductImage}" alt="${products[i].getProductCategory}">
					<div class="card-body">
						<h5 class="card-title">${products[i].getProductTitle}</h5>
						<p class="card-text">${products[i].getProductDescription}</p>
						<h6 class="card-text">$${products[i].getProductPrice}</h6>
						<a onclick="addToCart(${i})" class="btn btn-primary">Add to Cart</a>
					</div>
				</div>
			</div>`
		);
	}
}

function convertToJSON(){ // converts customer information and their cart to json
	if($("#same-address").is(":checked")) {
		order = {
							card_number: $('#cc-number').val(),
							expiry_month: $('#cc-expirationMonth').val(),
							expiry_year: $('#cc-expirationYear').val(),
							security_code: $('#cc-cvv').val(),
							amount: getFinalOrderTotal().toFixed(2),
							currency: document.getElementById("selectedCurrency").value,
							billing: {
								first_name: $('#firstName').val(),
								last_name: $('#lastName').val(),
								address_1: $('#address').val(),
								address_2: $('#address2').val(),
								city: $('#city').val(),
								province: $('#state').val() + $('#province').val(),
								country: $('#country').val(),
								postal: $('#zip').val(),
								phone: $('#phone').val(),
								email: $('#email').val()
							},
							shipping: {
								first_name: $('#firstName').val(),
								last_name: $('#lastName').val(),
								address_1: $('#address').val(),
								address_2: $('#address2').val(),
								city: $('#city').val(),
								province: $('#state').val() + $('#province').val(),
								country: $('#country').val(),
								postal: $('#zip').val(),
							}
						}
	} else {
		order = {
							card_number: $('#cc-number').val(),
							expiry_month: $('#cc-expirationMonth').val(),
							expiry_year: $('#cc-expirationYear').val(),
							security_code: $('#cc-cvv').val(),
							amount: getFinalOrderTotal().toFixed(2),
							currency: document.getElementById("selectedCurrency").value,
							billing: {
								first_name: $('#firstName').val(),
								last_name: $('#lastName').val(),
								address_1: $('#address').val(),
								address_2: $('#address2').val(),
								city: $('#city').val(),
								province: $('#state').val() + $('#province').val(),
								country: $('#country').val(),
								postal: $('#zip').val(),
								phone: $('#phone').val(),
								email: $('#email').val()
							},
							shipping: {
								first_name: $('#shipFirstName').val(),
								last_name: $('#shipLastName').val(),
								address_1: $('#shipAddress').val(),
								address_2: $('#shipAddress2').val(),
								city: $('#shipCity').val(),
								province: $('#shipState').val() + $('#shipProvince').val(),
								country: $('#shipCountry').val(),
								postal: $('#shipZip').val(),
							}
						};
	}
	clearConfirmScreen();
	submitOrder();
}

function clearConfirmScreen(){
	$('#finalOrderDetails').empty();
}

function getShippingCost(){
	let shippingCost = 0;
	for(let i = 0; i < shoppingList.length; i++){
		shippingCost += shoppingList[i].getItemQuantity;
	}
	return (shippingCost * 4);
}

function getTax(){
	return ((shoppingCartTotal() + getShippingCost()) * 0.12);
}

function getFinalOrderTotal(){
	return (getTax() + getShippingCost() + parseInt(shoppingCartTotal()));
}

function orderDetails(){ // displays order details on confirmation modal

	for(let i = 0; i < shoppingList.length; i++){
		$('#finalOrderDetails').append(
			`<div class="row">
				<div class="col-5">${shoppingList[i].getProductTitle}</div>
				<div class="col-1 text-center">${shoppingList[i].getItemQuantity}</div>
				<div class="col-3 text-center">$${getCurrency(shoppingList[i].getProductPrice)}</div>
				<div class="col-3 text-center">$${shoppingList[i].getItemQuantity * getCurrency(products[i].getProductPrice)}</div>
			</div>`
		);
	}
	$('#finalOrderDetails').append('<hr class="my-4">');
	$('#finalOrderDetails').append( // subtotal
		`<div class="row">
			<div class="col-5"><b>Subtotal</b></div>
			<div class="col-4"></div>
			<div class="col-2 text-end">$${shoppingCartTotal()}</div>
		</div>`
	);
	$('#finalOrderDetails').append( // shipping cost
		`<div class="row">
			<div class="col-5"><b>Shipping</b></div>
			<div class="col-4"></div>
			<div class="col-2 text-end">$${getShippingCost().toFixed(2)}</div>
		</div>`
	);
	$('#finalOrderDetails').append( // tax
		`<div class="row">
			<div class="col-5"><b>Tax</b></div>
			<div class="col-4"></div>
			<div class="col-2 text-end">$${getTax().toFixed(2)}</div>
		</div>`
	);
	$('#finalOrderDetails').append( // order total
		`<div class="row">
			<div class="col-5"><b>Order Total</b></div>
			<div class="col-4"></div>
			<div class="col-2 text-end">$${getFinalOrderTotal().toFixed(2)}</div>
		</div>`
	);
}

function checkOrderValidity(){ // does a lousy job on checking if form has been filled out. I think it does not get along with bootstraps validation
	if($('#orderForm').valid()){
		$('#orderDetailsFooter').show()
	}
}

async function submitOrder() { // submits order to deepblue and handles errors
	const formData = new FormData();
	formData.set('submission', await JSON.stringify(order));
	const response = await fetch("https://deepblue.camosun.bc.ca/~c0180354/ics128/final/", {
		method: "POST",
		cache: 'no-cache',
		body: formData,
	}).then(res => res.json())
	  .then(json=> {
		  if(json.status === "SUCCESS"){
			$('#orderStatusInfo').append(
				`<div>Order placed!</div>`
			)
		  	emptyCart();
			document.getElementById("orderForm").reset();
		  } else {

			  $('#orderStatusInfo').append(`<div><h3>Something went wrong :(</h3></div>`);

			  if(json.error.billing.address_1 !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.billing.address_1)}</div>`);}
			  if(json.error.billing.city !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.billing.city)}</div>`);}
			  if(json.error.billing.email !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.billing.email)}</div>`);}
			  if(json.error.billing.first_name !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.billing.first_name)}</div>`);}
			  if(json.error.billing.last_name !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.billing.last_name)}</div>`);}
			  if(json.error.billing.phone !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.billing.phone)}</div>`);}
			  if(json.error.billing.province !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.billing.province)}</div>`);}
			  if(json.error.card_number !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.card_number)}</div>`);}
			  if(json.error.expiry_month !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.expiry_month)}</div>`);}
			  if(json.error.expiry_year !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.expiry_year)}</div>`);}
			  if(json.error.security_code !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.security_code)}</div>`);}
			  if(json.error.shipping.address_1 !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.shipping.address_1)}</div>`);}
			  if(json.error.shipping.city !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.shipping.city)}</div>`);}
			  if(json.error.shipping.first_name !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.shipping.first_name)}</div>`);}
			  if(json.error.shipping.last_name !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.shipping.last_name)}</div>`);}
			  if(json.error.shipping.province !== 'undefined'){$('#orderStatusInfo').append(`<div>${JSON.stringify(json.error.shipping.province)}</div>`);}

			  $('#orderStatusInfo').append(`<div><b>${(JSON.stringify(json.status))}</b></div>`);
			}
	  })
}

/***********************************/
/*Stuff that runs in the background*/
/***********************************/

$("#shippingDiv").hide();
$("#same-address").click(function() { // if shipping address is same as billing it is hidden
	if($(this).is(":checked")) {
		$("#shippingDiv").hide(300);
	} else {
		$("#shippingDiv").show(200);
	}
});

$("#shipStateSelect").hide();
$("#stateSelect").hide();
$(document).ready(function(){ // switches state select to province select depending on the country
	$('#shipCountry').on('change', function() {
		if ( this.value == 'CA')
		{
			$("#shipProvinceSelect").show();
			$("#shipStateSelect").hide();
		}
		else
		{
			$("#shipProvinceSelect").hide();
			$("#shipStateSelect").show();
		}
	});

	$('#country').on('change', function() {
		if ( this.value == 'CA')
		{
			$("#provinceSelect").show();
			$("#stateSelect").hide();
		}
		else
		{
			$("#provinceSelect").hide();
			$("#stateSelect").show();
		}
	});
});

$('#orderDetailsFooter').hide();

//** bootstrap form validation **//
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
	'use strict'

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation')

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})
})()

class Catalog { // create product objects

	constructor(jsonData) {
		this.productId = jsonData.id;
		this.productTitle = jsonData.title;
		this.productPrice = jsonData.price;
		this.productDescription = jsonData.description;
		this.productCategory = jsonData.category;
		this.productImage = jsonData.image;
		this.productRating = jsonData.rating;
		this.itemQuantity = 0;
	}

	get getProductId() {
		return this.productId;
	}

	get getProductTitle() {
		return this.productTitle;
	}

	get getProductPrice() {
		return this.productPrice;
	}

	get getProductDescription() {
		return this.productDescription;
	}

	get getProductCategory() {
		return this.productCategory;
	}

	get getProductImage() {
		return this.productImage;
	}

	get getProductRating() {
		return this.productRating;
	}

	get getItemQuantity() {
		return this.itemQuantity;
	}

	set setItemQuantity(value) {
		this.itemQuantity = value;
	}
}

class Currencies { // stores today's currency exchange rates
	constructor(jsonData) {
		this.usdollar = jsonData.cad.usd;
		this.euro = jsonData.cad.eur;
	}

	get getUsDollar() {
		return this.usdollar;
	}

	get getEuro() {
		return this.euro;
	}
}