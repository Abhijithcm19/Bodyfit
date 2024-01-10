const mongoose = require("mongoose");
const { addToCart } = require("../controllers/adminController");

const userModel = require("./userModel");
const productModel = require("./productModel");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
  },

  cartItems: [
    {
      productId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  discoundamount: {
    type: Number,
  },
  total: {
    type: Number,
  },
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
