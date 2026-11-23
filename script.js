// RESTAURANT RESERVATION FORM

const reservationForm = document.getElementById("reservationForm");

const bookingDate = document.getElementById("bookingDate");

// Set minimum booking date to today
const today = new Date();

const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

bookingDate.min = localToday;


// Form submission

reservationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();

    const email = document.getElementById("customerEmail").value.trim();

    const phone = document.getElementById("customerPhone").value.trim();

    const date = bookingDate.value;

    const guests = document.getElementById("guests").value;

    const message = document.getElementById("message").value.trim();

    const formMessage = document.getElementById("formMessage");


    if (!/^[0-9]{10}$/.test(phone)) {

        formMessage.textContent = "Please enter a valid 10-digit phone number.";

        formMessage.style.color = "#ff6666";

        return;
    }

    const selectedDate = new Date(date + "T00:00:00");

    const currentDate = new Date(localToday + "T00:00:00");

    if (!date || selectedDate < currentDate) {

        formMessage.textContent = "Please select a valid booking date.";

        formMessage.style.color = "#ff6666";

        return;
    }


    // Replace this with the restaurant owner's WhatsApp number.
    const restaurantNumber = "919902654553";

    const whatsappMessage =
        `Hello Foodie Restaurant!

I would like to request a table reservation.

Name: ${name}
Email: ${email}
Phone: ${phone}
Date: ${date}
Guests: ${guests}
Special Request: ${message || "None"}

Please confirm availability. Thank you!`;


    const whatsappURL =
        `https://wa.me/${restaurantNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank");

    formMessage.textContent =
        "Your reservation request is ready in WhatsApp. Please send the message to the restaurant.";

    formMessage.style.color = "#ff8c32";

});




// Mobile Navigation Menu

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function() {

    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";

});

// Close menu after clicking a navigation link

document.querySelectorAll(".nav-links a").forEach(function(link) {

    link.addEventListener("click", function() {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    });

});

// SHOPPING CART SYSTEM

let cart = JSON.parse(localStorage.getItem("foodieCart") || "[]");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const emptyCart = document.getElementById("emptyCart");
const checkoutBtn = document.getElementById("checkoutBtn");

// Add food to cart

document.querySelectorAll(".order-btn").forEach(button => {

    button.addEventListener("click", function() {

        const name = this.dataset.item;
        const price = Number(this.dataset.price);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

    });

});

// Update cart

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <div>
                    <h3>${item.name}</h3>
                    <p>₹${item.price} each</p>
                </div>

                <div class="quantity-controls">

                    <button data-action="decrease"
                            data-index="${index}">−</button>

                    <span>${item.quantity}</span>

                    <button data-action="increase"
                            data-index="${index}">+</button>

                    <button class="remove-btn"
                            data-action="remove"
                            data-index="${index}">Remove</button>

                </div>

            </div>

        `;

    });

    cartTotal.textContent = total;

    // Update navbar cart counter
const cartCount = document.getElementById("cartCount");

cartCount.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
);

// Save cart in browser storage
localStorage.setItem("foodieCart", JSON.stringify(cart));

    emptyCart.style.display = cart.length === 0 ? "block" : "none";

    checkoutBtn.disabled = cart.length === 0;

}

// Quantity and remove buttons

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "increase") {
        cart[index].quantity++;
    }

    if (action === "decrease") {
        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    if (action === "remove") {
        cart.splice(index, 1);
    }

    updateCart();

});

// WhatsApp Checkout

checkoutBtn.addEventListener("click", function() {

    const checkoutForm = document.getElementById("checkoutForm");

    if (!checkoutForm.reportValidity()) {
        return;
    }

    const customerName = document.getElementById("orderCustomerName").value.trim();
    const customerPhone = document.getElementById("orderCustomerPhone").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    const restaurantNumber = "919902654553";

    let message = "Hello Foodie Restaurant! I want to place an order.\n\n";

    message += "CUSTOMER DETAILS\n";
    message += `Name: ${customerName}\n`;
    message += `Mobile: ${customerPhone}\n`;
    message += `Address: ${customerAddress}\n`;
    message += `Payment: ${paymentMethod}\n\n`;

    message += "ORDER DETAILS\n";

    let total = 0;

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        message += `${item.name} x ${item.quantity} = ₹${itemTotal}\n`;

        total += itemTotal;

    });

    message += `\nTotal Amount: ₹${total}`;
    message += "\n\nPlease confirm my order.";

    const whatsappURL =
        `https://wa.me/${restaurantNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

    alert("Your order details are ready! Please press SEND in WhatsApp to submit your order. The restaurant will confirm your order.");

});

updateCart();



