import { menuArray } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.box');
  const box2 = document.querySelector('.box2');

  let allMenus = '';
  menuArray.forEach((menu) => {
    allMenus += `
      <div class="menu-item">
        <h2>${menu.name} ${menu.emoji}</h2>
        <p>${menu.ingredients.join(', ')}</p>
        <i data-id="${menu.id}" class="fa-solid fa-plus clickable-icon"></i>
        <p><strong>Price: $${menu.price}</strong></p>
      </div>
    `;
  });

  box.innerHTML = allMenus;

  let addMenuArry = []; // This array stores items and their quantities

  // Attach event listeners after the innerHTML is updated
  const clickableIcons = document.querySelectorAll('.clickable-icon');
  clickableIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
      const itemId = Number(e.target.dataset.id);
      const itemIndex = addMenuArry.findIndex((item) => item.id === itemId);

      if (itemIndex === -1) {
        // Item not in array, add it with initial quantity of 1
        const itemToAdd = menuArray.find((menu) => menu.id === itemId);
        if (itemToAdd) {
          addMenuArry.push({ ...itemToAdd, quantity: 1 });
          renderOrder(addMenuArry);
        }
      } else {
        // Item already in array, increase the quantity
        addMenuArry[itemIndex].quantity += 1;
        renderOrder(addMenuArry);
      }
    });
  });

  function setupEventListeners() {
    document.querySelectorAll('.decrease').forEach((button) => {
      button.addEventListener('click', function () {
        decreaseQuantity(this.getAttribute('data-index'));
      });
    });

    document.querySelectorAll('.remove').forEach((button) => {
      button.addEventListener('click', function () {
        removeItem(this.getAttribute('data-index'));
      });
    });
  }

  function renderOrder(items) {
    let addMenu = '<h2>Your Order</h2>';
    let grandTotal = 0;
    items.forEach((item, index) => {
      const totalItemPrice = item.price * item.quantity;
      grandTotal += totalItemPrice;
      addMenu += `
            <div>
                <p>${item.name} x ${item.quantity}
                <button class="decrease" data-index="${index}">-</button>
                <button class="remove" data-index="${index}">Remove</button>
                </p>
                <p>Total: $${totalItemPrice}</p>
            </div>
        `;
    });

    addMenu += `<h3>Grand Total: $${grandTotal}</h3>`;

    if (grandTotal > 0) {
      addMenu += `<button id="completeOrder">Complete Your Order</button>`;
    }

    box2.innerHTML = addMenu;

    if (grandTotal > 0) {
      setupEventListeners(); // Setup event listeners if items are present
      document
        .getElementById('completeOrder')
        .addEventListener('click', showPaymentForm);
    } else {
      // If grand total is 0, ensure any payment form is removed or hidden
      const paymentForm = document.querySelector('.payment-form');
      if (paymentForm) paymentForm.style.display = 'none'; // Hide payment form if it exists
    }
  }

  function decreaseQuantity(index) {
    const item = addMenuArry[index];
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      removeItem(index); // If quantity is 1, remove the item instead of decreasing to zero
    }
    renderOrder(addMenuArry); // Re-render the order to reflect the changes
  }

  function removeItem(index) {
    addMenuArry.splice(index, 1);
    renderOrder(addMenuArry); // Re-render the order to reflect the changes
  }

  function showPaymentForm() {
    const paymentFormHtml = `
        <div class="payment-form" style="display:block;">
            <input type="text" id="name" placeholder="Name on Card" required>
            <input type="text" id="cardNumber" placeholder="Card Number" required pattern="\\d*">
            <input type="text" id="cvv" placeholder="CVV" required pattern="\\d*">
            <button type="submit" id="payButton">Pay</button>
        </div>
    `;
    // Append or update existing payment form
    const existingForm = document.querySelector('.payment-form');
    if (existingForm) {
      existingForm.style.display = 'block'; // Show existing form if already present
    } else {
      box2.innerHTML += paymentFormHtml;
      document
        .getElementById('payButton')
        .addEventListener('click', processPayment);
    }
  }
  function processPayment() {
    // Retrieve the input values
    const name = document.getElementById('name').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const cvv = document.getElementById('cvv').value;

    // Check if any of the fields are empty
    if (!name || !cardNumber || !cvv) {
      alert('Please fill out all fields.');
      return; // Stop the function if any field is empty
    }

    // If all fields are filled, display the thank you message
    box2.innerHTML =
      "<p class='thank-you-message'>Thanks,Your order is on its way!!, you will be redirect to the home page...</p>";

    setTimeout(function () {
      location.reload(); // Refreshes the page
    }, 7000);
  }
});
