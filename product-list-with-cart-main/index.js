const cart = {};

function addToCart(button) {
  button.style.display = 'none';

  const itemCard = button.closest('.item-card');

  const itemImage = itemCard.querySelector('.item-image');
  itemImage.classList.add('selected');

  const quantityController = itemCard.querySelector('.quantity-controller');
  quantityController.classList.remove('hidden');

  const itemName = itemCard.querySelector('.item-name2').textContent;
  const itemImageSrc = itemCard.querySelector('.item-image').src;
  const itemPrice = parseFloat(itemCard.querySelector('.item-price').textContent.replace('$', ''));

  if (!cart[itemName]) {
    cart[itemName] = { quantity: 1, price: itemPrice, imageSrc: itemImageSrc  };
  } else {
    cart[itemName].quantity += 1;
  }

  itemCard.querySelector('.quantity-number').textContent = cart[itemName].quantity;

  updateCart();

}

function incrementQuantity(button) {
  const quantitySpan = button.previousElementSibling;
  const itemCard = button.closest('.item-card');
  const itemName = itemCard.querySelector('.item-name2').textContent;

  cart[itemName].quantity += 1;

  quantitySpan.textContent = cart[itemName].quantity;

  updateCart();
}

function decrementQuantity(button) {
  const quantitySpan = button.nextElementSibling;
  const itemCard = button.closest('.item-card');
  const itemImage = itemCard.querySelector('.item-image');
  const itemName = itemCard.querySelector('.item-name2').textContent;

  cart[itemName].quantity -= 1;

  if (cart[itemName].quantity === 0) {
    delete cart[itemName]; 

    itemImage.classList.remove('selected');
    button.closest('.quantity-controller').classList.add('hidden');
    itemCard.querySelector('.add-to-cart-btn').style.display = 'flex';
    quantitySpan.textContent = '1';
  } else {
    quantitySpan.textContent = cart[itemName].quantity;
  }

  updateCart();
}

function updateCart() {
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartItemsContainer = document.getElementById("cart-items");
  const orderTotal = cartSidebar.querySelector('.order-total p:last-child');
  const cartCount = cartSidebar.querySelector('h2');

  cartItemsContainer.innerHTML = ''; 

  let totalQuantity = 0;
  let totalPrice = 0;

  // Populate the cart with current items
  for (const itemName in cart) {
    const item = cart[itemName];
    const itemTotalPrice = item.price * item.quantity;
    totalQuantity += item.quantity;
    totalPrice += itemTotalPrice;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item-details">
        <span class="cart-item-name">${itemName}</span>
        <span class="cart-item-quantity-price">
          <span class="cart-item-quantity">${item.quantity}x</span> 
          <span>@ $${item.price.toFixed(2)}</span> 
          <span class="cart-item-total-price">$${itemTotalPrice.toFixed(2)}</span>
        </span>
      </div>
      <button class="remove-item-btn" onclick="removeItem('${itemName}')">&times;</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  }

  // Update cart count and total price
  cartCount.textContent = `Your Cart (${totalQuantity})`;
  orderTotal.textContent = `$${totalPrice.toFixed(2)}`;
  const cartEmpty = document.querySelector('.cart-empty');
  const confirmOrder = document.querySelector('.confirm-order');
  const totalOrder = document.querySelector('.order-total');
  if (totalQuantity > 0) {
    cartEmpty.classList.add('hidden');
    confirmOrder.classList.remove('hidden')
    totalOrder.classList.remove('hidden')
  } else {
    confirmOrder.classList.add('hidden')
    totalOrder.classList.add('hidden')
    cartEmpty.classList.remove('hidden');
  }
}

function removeItem(itemName) {
  if (cart[itemName]) {
    delete cart[itemName];

    const itemCards = document.querySelectorAll('.item-card');
    itemCards.forEach(card => {
      if (card.querySelector('.item-name2').textContent === itemName) {
        card.querySelector('.item-image').classList.remove('selected');
        card.querySelector('.add-to-cart-btn').style.display = 'flex';
        card.querySelector('.quantity-controller').classList.add('hidden');
        card.querySelector('.quantity-number').textContent = '1';
      }
    });

    updateCart();
  }
}

// Fetch the data from the JSON file
fetch('data.json')
  .then(response => response.json())
  .then(dessertsData => {
    renderDesserts(dessertsData);
  })
  .catch(error => console.log("Error loading data:", error));

function renderDesserts(dessertsData) {
  const dessertsContainer = document.getElementById("desserts-container");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 
  });

  dessertsData.map(dessert => {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");

    itemCard.innerHTML = `
      <div class="item-image-container">
        <img class="item-image" src="${dessert.image.desktop}" alt="${dessert.name}">
        <div class="quantity-controller hidden">
          <button class="minus-quantity-btn" onclick="decrementQuantity(this)"><img src="./assets/images/icon-decrement-quantity.svg" alt="minus"></button>
          <span class="quantity-number">1</span>
          <button class="add-quantity-btn" onclick="incrementQuantity(this)"><img src="./assets/images/icon-increment-quantity.svg" alt="add"></button>
        </div>
        <div class="add-to-cart-container">
          <button onclick="addToCart(this)" class="add-to-cart-btn">
            <img class="add-to-cart-icon" src="./assets/images/icon-add-to-cart.svg" alt="addToCart">Add to Cart
          </button>
        </div>
      </div>
      <div class="item-info">
        <div>
          <div class="item-name">${dessert.category}</div>
          <div class="item-name2">${dessert.name}</div>
        </div>
        <div class="item-price">$${dessert.price.toFixed(2)}</div>
      </div>
    `;

    dessertsContainer.appendChild(itemCard);

    observer.observe(itemCard);
  });
}


function closeModal() {
  document.querySelector('.modal-overlay').style.display = 'none';
  clearCart();
}

function closeSignUp() {
  document.querySelector('.signUpModal').style.display = 'none';
  document.querySelector('.mob-header').style.display = 'none';
}

function clearCart() {
  for (const itemName in cart) {
    delete cart[itemName];
  }

  const itemCards = document.querySelectorAll('.item-card');
  itemCards.forEach(card => {
    card.querySelector('.item-image').classList.remove('selected');
    card.querySelector('.add-to-cart-btn').style.display = 'flex';
    card.querySelector('.quantity-controller').classList.add('hidden');
    card.querySelector('.quantity-number').textContent = '1';
  });

  updateCart();
}
document.addEventListener("DOMContentLoaded", function () {
  
  const confirmOrderButton = document.querySelector('.confirm-order');
  confirmOrderButton.addEventListener('click', showOrderModal);

  
  function showOrderModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = ''; 

    for (const itemName in cart) {
      const item = cart[itemName];
      const itemTotalPrice = item.price * item.quantity;

      const modalItem = document.createElement('div');
      modalItem.classList.add('order-summary');
      modalItem.innerHTML = `
      <div class="order-item">
              <img src=${item.imageSrc} alt="Classic Tiramisu">
              <div class="order-item-details">
                  <span class="order-item-name">${itemName}</span><br>
                  <span class="order-item-qty">${item.quantity}x  @ $${item.price.toFixed(2)}</span>
              </div>
              <span>$${itemTotalPrice.toFixed(2)}</span>
       </div>
      `;

      modalContent.appendChild(modalItem);
    }

    const orderTotal = document.querySelector('.order-total p:last-child').textContent;
    const modalTotal = document.createElement('div');
    modalTotal.classList.add('order-total2');
    modalTotal.innerHTML = `
      <span>Order Total:</span>
      <span>${orderTotal}</span>
    `;

    modalContent.appendChild(modalTotal);

    modalOverlay.style.display = 'flex';
  }


});


function displaySignUpmodal(){
  document.querySelector('.signUpModal').style.display = 'flex';
}

function toggleMenu(){
  document.querySelector('.mob-header').style.display = 'block';
}