const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const moment   = require('moment')
// const ObjectId = Schema.ObjectId;

const couponSchema = new mongoose.Schema({
  couponName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  couponCode: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  minimumAmount: {
    type: Number,
    required: true,
  },
  maximumAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
