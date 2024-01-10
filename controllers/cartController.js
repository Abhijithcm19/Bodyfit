const { response } = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/connection");
const session = require("express-session");
const mongoose = require("mongoose");
const sendOtp = require("../multer&nodemailer/nodemailer");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const orderModel = require("../models/oderModel");
const carts = require("../models/cart");
const nodemailer = require("nodemailer");
const Wishlist = require("../models/wishlist");
const couponModel = require("../models/couponModel");
const Category = CategoryModel.category;

const viewCartPage = async (req, res, next) => {
  const email = req.session.userEmail;
  const user = await UserModel.findOne({ email: email });
  const userId = user._id;

  const cartList = await carts.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$cartItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItems.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
  ]);

  res.render("../views/user/cart.ejs", {
    cartList: cartList,
    userId: req.session.username,
  });
};

const getshopdetails = async (req, res) => {
  const id = req.params.id;
  try {
    const products = await ProductModel.findOne({ _id: id });

    res.render("../views/user/Productdetails.ejs", {
      product: products,
      ses: req.session.userEmail,
      ses: req.session.username,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    const email = req.session.userEmail;
    let userid = await UserModel.findOne({ email: email });
    let userCart = await carts.findOne({ userId: userid });

    if (req.query?.productid && req.session.username) {
      if (!userCart) {
        await carts.insertMany([{ userId: userid }]);
        userCart = await carts.findOne({ userId: userid });
      }
      let itemIndex = userCart.cartItems.findIndex((cartItems) => {
        return cartItems.productId == req.query.productid;
      });
      if (itemIndex > -1) {
        await carts.updateOne(
          { userId: userid, "cartItems.productId": req.query.productid },
          {
            $inc: { "cartItems.$.qty": 1 },
          }
        );
      } else {
        await carts.updateOne(
          { userId: userid },
          {
            $push: { cartItems: { productId: req.query.productid, qty: 1 } },
          }
        );
      }
      res.redirect("/cart");
    }
  } catch (err) {
    console.log(err);
  }
};

const removeCartItemPage = async (req, res) => {
  const id = req.query.id;
  const objId = mongoose.Types.ObjectId(req.query.id);
  await carts
    .updateOne(
      { "cartItems.productId": objId },
      { $pull: { cartItems: { productId: objId } } }
    )
    .then(() => {
      res.json({ status: true });
    });
};

const postCartIncDec = async (req, res, next) => {
  try {
    const type = req.params.type;
    const userId = req.body.user_id;
    const productId = req.body.product_id;

    let update = {};
    if (type === "inc") {
      update = { $inc: { "cartItems.$.qty": 1 } };
    } else if (type === "dec") {
      update = { $inc: { "cartItems.$.qty": -1 } };
    } else {
      return res.status(400).json({
        error: "Invalid type parameter. Only 'inc' or 'dec' are allowed.",
      });
    }

    const result = await carts.updateOne(
      { userId: userId, "cartItems.productId": productId },
      update
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    res.json({
      msg: "Cart item quantity updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

module.exports = {
  addToCart,
  postCartIncDec,
  removeCartItemPage,
  getshopdetails,
  viewCartPage,
};
