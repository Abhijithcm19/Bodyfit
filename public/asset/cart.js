

// function incrementCount(userId, productId, price) {
//     const baseUrl = window.location.origin;
//     let quantity = document.querySelector("#Quantity" + productId);
//     let total = document.querySelector("#total-price" + productId);


//     let sub_total = document.querySelector("#total-amount1");
//     let total_amount = document.querySelector("#total-amount2");
  
    
//     fetch(baseUrl + "/increment-decrement-count/inc", {
//       method: "PUT",
//       headers: {
//         Accept: "application/json, text/plain, */*",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         product_id: productId,
//         user_id: userId,
//       }),
//     }).then(() => {
//       quantity.innerText = Number(quantity.innerText) + 1;

//       total_amount.innerText = Number(total_amount.innerText) + Number(price);
//       sub_total.innerText = Number(sub_total.innerText) + Number(price);
//       total.innerText = parseInt(total.innerText) + Number(price);
//     });
//   }
  
  
  
function incrementCount(userId, productId, price, maxQuantity) {
  const baseUrl = window.location.origin;
  let quantity = document.querySelector("#qty" + productId);
  let total = document.querySelector("#total-price" + productId);
  let sub_total = document.querySelector("#total-amount1");
  let total_amount = document.querySelector("#total-amount2");

  // Get the current quantity and check if it has reached the maximum limit
  let currentQuantity = Number(quantity.innerText);
  
  if (currentQuantity >= maxQuantity) {
// Replace this line:

// With this line:
Swal.fire({
  icon: 'warning',
  title: `Out Of Stock`,
  showConfirmButton: false,
  timer: 2000
});
    return;
  }

  fetch(baseUrl + "/increment-decrement-count/inc", {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      user_id: userId,
    }),
  }).then(() => {
    quantity.innerText = currentQuantity + 1;
    total_amount.innerText = Number(total_amount.innerText) + Number(price);
    sub_total.innerText = Number(sub_total.innerText) + Number(price);
    total.innerText = parseInt(total.innerText) + Number(price);
  });
}


  
  
  function decrementCount(userId, productId, price) {
    let quantity = document.querySelector("#qty" + productId);
    let total = document.querySelector("#total-price" + productId);

    let sub_total = document.querySelector("#total-amount1");

    let total_amount = document.querySelector("#total-amount2");
    const baseUrl = window.location.origin;
    if (Number(quantity.innerText) > 1) {
      fetch(baseUrl + "/increment-decrement-count/dec", {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          user_id: userId,
        }),
      }).then(() => {
        quantity.innerText = Number(quantity.innerText) - 1;
        total.innerText = parseInt(total.innerText) - Number(price);
        total_amount.innerText = Number(total_amount.innerText) - Number(price);
        sub_total.innerText = Number(sub_total.innerText) - Number(price);
      });
    } else {
      console.log("error");
    }
  }
  
  
  
  
  
  // Make an AJAX request to update the total price
  function updateTotalPrice(quantity, productId) {
    $.ajax({
      url: "/update-total-price",
      type: "POST",
      data: {
        quantity: quantity,
        productId: productId,
      },
      success: function (data) {
        // Update the total price on the page
        $("#total-price").text(data.totalPrice);
      },
    });
  }
  

  
// cart product delete

function deleteItem(productId,price) {

  console.log("data entering");

  let quantity = document.querySelector("#Quantity" + productId);
  let total = document.querySelector("#total-price" + productId);
  let sub_total = document.querySelector("#total-amount1");
  let total_amount = document.querySelector("#total-amount2");
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        fetch(`/removecart?id=${productId}`, {
          method: 'PUT',
        })
        .then(response => {
          console.log(response);
          const itemRow = document.getElementById(`cart-item-${productId}`);
          if (itemRow) {
            itemRow.remove();
            total.innerText = parseInt(total.innerText) - Number(price);
            total_amount.innerText = Number(total_amount.innerText) - Number(price);
            sub_total.innerText = Number(sub_total.innerText) - Number(price);
          }
        })
        .catch(error => {
          // Handle errors here
          console.error(error);
        });
      }
    });
  }



  let status = false
  function applyCoupon() {
    const couponCode = document.getElementById("coupon-code-input").value;
    let total_amount = document.querySelector("#total-amount1");
    console.log(total_amount);
    const amount = total_amount.textContent;
    if(!status){
      fetch("/couponcheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode: couponCode }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.minimumAmount);
  
        if (data.minimumAmount <= total_amount.innerText) {
          const discountAmount = data.discount / 100;
          const totalDiscount = Number(total_amount.innerText * discountAmount);
          const newTotal = Number(total_amount.innerText - totalDiscount);
          total_amount.innerText = newTotal;
          status=true;
          Swal.fire({
            icon: 'success',
            title: 'Coupon applied successfully!',
            text: `Discount: ${totalDiscount.toFixed(2)}\nNew total: ${newTotal.toFixed(2)}`,
          });
        } else {
          console.log("Minimum amount not met");
          Swal.fire({
            icon: 'warning',
            title: 'Minimum amount not met',
            text: `The minimum amount required for this coupon is ${data.minimumAmount}`,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to apply coupon:" + error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to apply coupon',
        });
      });
    }
  }
  



// function applyCoupon() {
//   const couponCode = document.getElementById("kkk").value;
//   console.log(couponCode)
//   let total_amount = document.querySelector("#total-amount1");

//   if(!status){
//     fetch("/couponcheck", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ couponCode: couponCode }),
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       console.log(data.minimumAmount);

//       if (data.minimumAmount <= total_amount.innerText) {
//         const discountAmount = data.discount / 100;
//         const totalDiscount = Number(total_amount.innerText * discountAmount);
//         const newTotal = Number(total_amount.innerText - totalDiscount);
//         total_amount.innerText = newTotal;
//         status=true;
//         Swal.fire({
//           icon: 'success',
//           title: 'Coupon applied successfully!',
//           text: `Discount: ${totalDiscount.toFixed(2)}\nNew total: ${newTotal.toFixed(2)}`,
//         });
//       } else {
//         console.log("Minimum amount not met");
//         Swal.fire({
//           icon: 'warning',
//           title: 'Minimum amount not met',
//           text: `The minimum amount required for this coupon is ${data.minimumAmount}`,
//         });
//       }
//     })
//     .catch((error) => {
//       console.error("Failed to apply coupon:" + error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: 'Failed to apply coupon',
//       });
//     });
//   }
// }






// document.querySelector("#paymentForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   let total_amount = document.querySelector("#totalAmount").innerText;
 
//   console.log(total_amount+"tatoal amount");

//   const payment = document.querySelectorAll('input[name="payment"]');
//   console.log(payment[0].value);
//   if (payment[1].value == "online") {
//     fetch("/order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({}),
//     })
//       .then((response) => response.json())
//       .then((order) => {
//         console.log(order);
//         var options = {
//           key: "rzp_test_jbSlDDRu4vCwER",
//           name: "Test Company",
//           amount:order.amount*100,

//           order_id: order.id,
//         };
//         var rzp = new Razorpay(options);
//         rzp.open();
//       })
//       .catch((error) => {
//         console.error("Failed to apply coupon:" + error);
//       });
//   }
// });

  
  
  
  