const { response } = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/connection");
const session = require("express-session");
const mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const Wishlist = require("../models/wishlist");
const carts = require("../models/cart");
const CategoryModel = require("../models/categoryModel");
const orderModel = require("../models/oderModel");

const displayWishlist = async (req, res, next) => {
  const email = req.session.userEmail;
  const user = await UserModel.findOne({ email: email });

  const userId = user._id;

  const wishlistData = await Wishlist.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$wishlistItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "wishlistItems.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
  ]);

  res.render("../views/user/wishlist", {
    wishlistData: wishlistData,
    userId: req.session.username,
  });
};

const addToWishlist = async (req, res) => {
  try {
    const email = req.session.userEmail;
    const user = await UserModel.findOne({ email: email });
    const userId = user._id;

    if (req.query?.productid && req.session.username) {
      const wishlist = await Wishlist.findOne({ userId: userId });

      if (!wishlist) {
        await Wishlist.insertMany([{ userId: userId }]);
      }

      const productExists = await Wishlist.exists({
        userId: userId,
        "wishlistItems.productId": req.query.productid,
      });

      if (!productExists) {
        await Wishlist.updateOne(
          { userId: userId },
          {
            $push: { wishlistItems: { productId: req.query.productid } },
          }
        );
      }

      res.redirect("/wishlist");
    }
  } catch (err) {
    console.log(err);
  }
};

const removeWishlist = async (req, res) => {
  const id = req.query.id;
  const objId = mongoose.Types.ObjectId(req.query.id);
  await Wishlist.updateOne(
    { "wishlistItems.productId": objId },
    { $pull: { wishlistItems: { productId: objId } } }
  ).then(() => {
    res.redirect("/wishlist");
  });
};

module.exports = {
  displayWishlist,
  addToWishlist,
  removeWishlist,
};
