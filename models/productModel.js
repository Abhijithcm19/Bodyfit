const mongoose = require("mongoose");
const objectid = mongoose.Types.objectid;
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    productname: {
      type: String,
    },
    kg: {
      type: Number,
    },
    flavor: {
      type: String,
    },
    qty: {
      type: Number,
    },
    firstQuantity: {
      type: Number,
    },

    price: {
      type: Number,
    },
    cost: {
      type: Number,
    },

    image_url: { type: Array },

    description: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    blockedDate: {
      type: Date,
      default: Date.now,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
    },

    pBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("products", productSchema);
module.exports = product;
