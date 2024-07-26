//! Variables
const cartBtn = document.querySelector(".cart-btn");
const clearCartBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");
const productsDom = document.querySelector("#products-dom");

let buttonsDOM = [];
let cart = [];

class Products {
  async getProducts() {
    try {
      let result = await fetch(
        "https://669fd103b132e2c136ff40b3.mockapi.io/products"
      );
      let data = await result.json();
      let products = data;
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `
        <div class="col-lg-4 col-md-6">
            <div class="product">
              <div class="product-image">
                <img src="${item.image}" alt="product" />
              </div>
              <div class="product-hover">
                <span class="product-title">${item.title}</span>
                <span class="product-title">$ ${item.price}</span>
                <button class="btn-add-to-cart" data-id="${item.id}">
                  <i class="fas fa-cart-shopping"></i>
                </button>
              </div>
            </div>
        </div>
        `;
    });
    productsDom.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.setAttribute("disabled", "disabled");
        button.opacity = ".3";
      } else {
        button.addEventListener("click", (event) => {
          event.target.disabled = true;
          event.target.style.opacity = ".3";
          // get product from products
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          // add product to the cart
          cart = [...cart, cartItem];
          // save cart in local storage
          Storage.saveCart(cart);
          // save cart values
          this.saveCartValues(cart);
          // display cart item
          this.addCartItem(cartItem);
          // show the cart
          this.showCart();
        });
      }
    });
  }

  saveCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const li = document.createElement("li");
    li.classList.add("cart-list-item");
    li.innerHTML = `
                  <div class="cart-left">
                <div class="cart-left-image">
                  <img src="${item.image}" alt="product" />
                </div>
                <div class="cart-left-info">
                  <a href="#" class="cart-left-info-title">${item.title}</a>
                  <span class="acrt-left-info-price">$ ${item.price}</span>
                </div>
              </div>
              <div class="cart-right">
                <div class="cart-right-quantity">
                  <button class="quantity-minus" data-id=${item.id}>
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity">${item.amount}</span>
                  <button class="quantity-plus" data-id=${item.id}>
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <div class="cart-right-remove">
                  <button class="cart-remove-btn" data-id=${item.id}>
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
    `;
    cartContent.appendChild(li);
  }

  showCart() {
    cartBtn.click();
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("ls-products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("ls-products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
