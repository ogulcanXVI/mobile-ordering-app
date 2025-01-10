import { menuArray, orderArray } from "./data.js";

const menu = document.getElementById("menu");
const cartProduct = document.getElementById("cart-product");
const totalPrice = document.getElementById("total-price");
const completeOrderBtn = document.getElementById("complete-order-btn");
const cardDetails = document.getElementById("card-details");
const paymentSubmit = document.getElementById("payment-submit");

let menuHtml = "";

// Data'sı eşleşen dataseti tetiklenince productId'ye callback ile gönder
document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    handleAddClick(e.target.dataset.add);
  }
});

function handleAddClick(productId) {
  // `menuArray` içinden id'si eşleşen ürünü bul
  const targetProduct = menuArray.find(function (product) {
    if (product.id === parseInt(productId)) {
      return product;
    }
  });

  if (!targetProduct.count) {
    targetProduct.count = 1;
  }

  if (orderArray.find((order) => targetProduct.id === order.id)) {
    targetProduct.count += 1;
  } else {
    orderArray.push(targetProduct);
  }

  console.log(targetProduct);
  console.log(targetProduct.count);

  updateOrders();
}

// Remove butonları için tıklama olayı
document.addEventListener("click", function (e) {
  if (e.target.dataset.remove) {
    handleRemoveClick(e.target.dataset.remove);
  }
});

// Sepetten ürünü kaldır
function handleRemoveClick(productId) {
  const targetProduct = menuArray.find(function (product) {
    if (product.id === parseInt(productId)) {
      return product;
    }
  });

  const orderIndex = orderArray.indexOf(targetProduct);
  if (orderArray[orderIndex].count === 1) {
    orderArray.splice(orderIndex, 1);
  } else {
    orderArray[orderIndex].count--;
  }

  updateOrders();
}

// Siparişleri cart kısmına bas, total price'ı da güncelle.
function updateOrders() {
  let orderHTML = "";

  orderArray.forEach(function (order) {
    orderHTML += `
            <div class="cart-item" id="cart-item-${order.id}">
                <div id="name-remove">
                    <h3 id="name">${order.name}</h3>
                    <button id="remove-btn" data-remove="${order.id}">Remove</button>
                    <div id="count">${order.count}x</div>
                    <div id="price">$${order.price}</div>
                </div>
             </div>
        
        `;
  });

  let newTotalPrice = 0;

  orderArray.map((order) => {
    newTotalPrice += order.price * order.count;
  });
  totalPrice.innerHTML = `$${newTotalPrice}`;

  cartProduct.innerHTML = orderHTML;
}

// Menü listesini ürün listesinde listele.
menuArray.forEach(function (product) {
  const productIngredients = product.ingredients
    .map(function (ingredient) {
      return ingredient;
    })
    .join(", ");

  menuHtml += `
        <div id="product">
            <div id="emoji">${product.emoji}</div>
                <div class="text">
                    <h3 id="name">${product.name}</h3>
                    <p>${productIngredients}</p>
                    <p id="price">$${product.price}</p>
                </div>
                <button id="add-order-btn" data-add="${product.id}">+</button>
            </div>
        <div id="line"></div>
    `;
});

menu.innerHTML = menuHtml;

// Credit Card ekleme pop upı görünmesi için bir koşul.
completeOrderBtn.addEventListener("click", () => {
  if (orderArray.length > 0) {
    cardDetails.style.display = "block";
  }
});

// Credit Card bilgileri girildikten sonra ödemeyi pop upı kapatıp thanks textini görüntüle.
paymentSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("submit oldu");
  cardDetails.style.display = "none";
  completeOrderBtn.style.display = "none";
  document.getElementById("thanks-text").style.display = "block";
  document.getElementById("cart").style.display = "none";
});
