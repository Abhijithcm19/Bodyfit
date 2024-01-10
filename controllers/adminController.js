const { response } = require("express");
const { name } = require("ejs");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const DataUri = new require("datauri/parser");
const dUri = new DataUri();
const uploadMiddleware = multer({ storage }).array("images", 10);
const uploadSingleImage = multer({ storage }).single("images");
const { cloudinaryConfig, uploader } = require("../config/cloudinary");
const AdminModel = require("../models/adminModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const UserModel = require("../models/userModel");
const orderModel = require("../models/oderModel");
const product = require("../models/productModel");
const path = require("path");
const fs = require("fs");
const couponModel = require("../models/couponModel");
const BannerModel = require("../models/banner");

const loginPage = async (req, res, next) => {
  try {
    let adminErr;
    let passErr;

    req.session.adminErr = null;
    req.session.passErr = null;
    if (!req.session.adminLogin) {
      res.render("admin/account-Login", {
        title: "Admin Login",
        login: req.session,
        adminErr,
        passErr,
      });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    next(error);
  }
};

const adminhomepageload = async (req, res) => {
  const order = await product.find();
  const boardorderdata = await orderModel.find();
  const userdata = await UserModel.find();
  const productcount = await product.find();
  const ordePending = await orderModel.find({ status: "pending" }).count();
  const Return = await orderModel.find({ status: "return" }).count();
  const shipped = await orderModel.find({ status: "shippid" }).count();
  const Delivered = await orderModel.find({ status: "delivered" }).count();
  const Cancelled = await orderModel.find({ status: "cancel" }).count();

  let orderPerMonth = [];
  for (let i = 0; i < 12; i++) {
    let numberOfOrders = await orderModel.find({ month: i }).count();
    orderPerMonth.push(numberOfOrders);
  }

  res.render("../views/admin/adminHome.ejs", {
    boardorderdata,
    order,
    userdata,
    productcount,
    ordePending,
    Return,
    shipped,
    Delivered,
    Cancelled,
    orderPerMonth,
  });
};

const usersPage = async (req, res, next) => {
  try {
    const Users = await UserModel.find();
    let index = 1;

    res.render("../views/admin/userList", { title: "Users", index, Users });
  } catch (error) {
    next(error);
  }
};

const getCategoryPage = async (req, res) => {
  try {
    const errorData = req.session.error;
    req.session.error = null;
    const categoryData = await CategoryModel.find({});
    const catData = { name: "Example Category" };
    res.render("../views/admin/categories", {
      errorData,
      catData,
      categorydetails: categoryData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const postCategoriesPage = (req, res) => {
  let categoryName = req.body.catname.trim();
  CategoryModel.findOne({ name: categoryName })
    .then((existingCategory) => {
      if (existingCategory) {
        req.session.error = "Category already exists.";
        res.redirect("/admin/categories");
      } else {
        const category = new CategoryModel({ name: categoryName });
        category
          .save()
          .then(() => {
            res.redirect("/admin/categories");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const productsPage = async (req, res, next) => {
  try {
    const Categories = await CategoryModel.find();
    const products = await ProductModel.find().sort({ createdAt: -1 });
    let index = 1;
    res.render("../views/admin/adminProductList", {
      title: "Products",
      index,
      Categories,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const addProductPage = (req, res) =>
  CategoryModel.find()
    .then((categories) => {
      const catData = { edit: false, categories, name: "add product" };

      res.render("../views/admin/adminProduct.ejs", { catData });
    })
    .catch((error) => {
      console.log(error);
    });

const addProduct = async (req, res, next) => {
  try {
    let images = [];

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const file = dUri.format(
          path.extname(req.files[i].originalname).toString(),
          req.files[i].buffer
        ).content;

        const result = await uploader.upload(file, {
          transformation: [
            { width: 800, height: 880, gravity: "face", crop: "fill" },
          ],
        });
        images.push(result);
      }
    }

    const newProduct = ProductModel({
      productname: req.body.productname,
      description: req.body.description,
      price: req.body.price,
      kg: req.body.kg,
      flavor: req.body.flavor,
      qty: req.body.Quantity,
      image_url: images,
      category: req.body.catagory_id,
    });

    const Product = new ProductModel(newProduct);
    await Product.save();
    res.redirect("/admin/product");
  } catch (error) {
    console.error(error);
  }
};

const doLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    if (admin) {
      if (email === admin.email && password === admin.password) {
        req.session.email = req.body.email;

        adminErr = "Email incorrnt";
        passErr = "password incorrnt";
        req.session.adminLogin = true;
        return res.redirect("/admin");
      } else {
        return res.redirect("/admin/login");
      }
    } else {
      return res.redirect("/admin/login");
    }
  } catch (error) {
    next(error);
  }
};

const doLogout = async (req, res, next) => {
  try {
    req.session.adminLogin = false;
    req.session.destroy();
    res.redirect("/admin/login");
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: true } }
    ).then(() => {
      return res.redirect("/admin/users");
    });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: false } }
    ).then(() => {
      return res.redirect("/admin/users");
    });
  } catch (err) {
    next(err);
  }
};

const blockCategory = async (req, res, next) => {
  const catId = req.params.id;
  try {
    await CategoryModel.updateOne(
      { _id: catId },
      { $set: { iBlocked: true } }
    ).then(() => {
      return res.redirect("/admin/categories");
    });
  } catch (err) {
    next(err);
  }
};

const unblockCategory = async (req, res, next) => {
  const catId = req.params.id;
  try {
    await CategoryModel.updateOne(
      { _id: catId },
      { $set: { iBlocked: false } }
    ).then(() => {
      return res.redirect("/admin/categories");
    });
  } catch (err) {
    next(err);
  }
};

const blockProduct = async (req, res, next) => {
  const proId = req.params.id;
  try {
    await ProductModel.updateOne(
      { _id: proId },
      { $set: { pBlocked: true } }
    ).then(() => {
      return res.redirect("/admin/product");
    });
  } catch (err) {
    next(err);
  }
};

const unblockProduct = async (req, res, next) => {
  const proId = req.params.id;
  try {
    await ProductModel.updateOne(
      { _id: proId },
      { $set: { pBlocked: false } }
    ).then(() => {
      return res.redirect("/admin/product");
    });
  } catch (err) {
    next(err);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const productData = await ProductModel.findOne({
      poroductid: req.params.id,
    });
    res.render("../views/admin/editProduct", {
      productData,
      productid: req.query.id,
    });
  } catch (err) {
    next(err);
  }
};

const productImageEdit = async (req, res, next) => {
  try {
    const public_id = req.params.public_id;
    const product_id = req.params.product_id;

    if (!req.file) {
      throw new Error("No image file provided");
    }

    const file = dUri.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;
    const result = await uploader.upload(file, {
      transformation: [
        { width: 800, height: 880, gravity: "face", crop: "fill" },
      ],
    });

    await ProductModel.updateOne(
      { _id: product_id, "image_url.public_id": public_id },
      {
        $set: {
          "image_url.$": result,
        },
      }
    );
    res.redirect("/admin/product");
  } catch (error) {
    next(error);
  }
};

const editProducts = async (req, res, next) => {
  const product_id = req.params.id;

  try {
    const userData = await ProductModel.findByIdAndUpdate(
      { _id: product_id },
      {
        $set: {
          productname: req.body.productname,
          kg: req.body.kg,
          flavor: req.body.flavor,
          Quantity: req.body.Quantity,
          price: req.body.price,
          description: req.body.description,
        },
      }
    );
    res.redirect("/admin/product");
  } catch (error) {
    next(error);
  }
};

const getCouponPage = async (req, res, next) => {
  const couponData = await couponModel.find();
  try {
    res.render("../views/admin/coupon", { couponData });
  } catch (error) {
    next(error);
  }
};

const addCoupn = async (req, res, next) => {
  const data = {
    couponName: req.body.couponName,
    description: req.body.des,
    couponCode: req.body.code,
    startDate: req.body.start,
    endDate: req.body.end,
    minimumAmount: req.body.mini,
    maximumAmount: req.body.maxLimit,
    discount: req.body.discount,
  };

  try {
    const coupon = new couponModel(data);
    await coupon.save();
    res.redirect("/admin/coupon");
  } catch (error) {
    next(error);
    console.log(error);
  }
};

//cupon edit page
const getCouponEditPage = async (req, res) => {
  try {
    const couponData = await couponModel.find({ _id: req.query.id });

    res.render("../views/admin/editcoupon.ejs", { couponData });
  } catch (error) {
    console.log(error);
  }
};

const postEditCoupon = async (req, res) => {
  try {
    const userData = await couponModel.findByIdAndUpdate(
      { _id: req.query.id },
      {
        $set: {
          couponName: req.body.couponName,
          description: req.body.des,
          couponCode: req.body.code,
          startDate: req.body.start,
          endDate: req.body.end,
          minimumAmount: req.body.mini,
          maximumAmount: req.body.maxLimit,
          discount: req.body.discount,
        },
      }
    );
    res.redirect("/admin/coupon");
  } catch (error) {
    console.log(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;
    await couponModel.updateOne({ _id: id }, { $set: { delete: true } });
    res.redirect("/admin/coupon");
  } catch (error) {
    next(error);
  }
};

const getBnner = async (req, res, next) => {
  try {
    const banners = await BannerModel.find();
    res.render("../views/admin/banner", { banners });
  } catch (error) {
    next(error);
  }
};
const addBanner = async (req, res, next) => {
  try {
    await BannerModel.create({
      offerType: req.body.offerType,
      bannerText: req.body.bannerText,
      couponName: req.body.couponName,
      bannerImage: req.body.bannerImage,
    }).then((data) => {
      res.redirect("/admin/banner");
    });
  } catch (err) {
    next(err);
  }
};

const blockBanner = async (req, res, next) => {
  const banID = req.params.id;
  try {
    await BannerModel.updateOne(
      { _id: banID },
      { $set: { banDeleted: true } }
    ).then(() => {
      return res.redirect("/admin/banner");
    });
  } catch (err) {
    next(err);
  }
};

const unblockBanner = async (req, res, next) => {
  const banID = req.params.id;

  try {
    await BannerModel.updateOne(
      { _id: banID },
      { $set: { banDeleted: false } }
    ).then(() => {
      return res.redirect("/admin/banner");
    });
  } catch (err) {
    next(err);
  }
};

const getCouponDeletPage = async (req, res) => {
  try {
    const couponData = await couponModel.findByIdAndDelete({
      _id: req.query.id,
    });
    res.redirect("/admin/coupon");
  } catch (error) {
    console.log(error);
  }
};

const getStaffTable = async (req, res, next) => {
  try {
    const staff = await AdminModel.find();
    let index = 1;

    res.render("../views/admin/staffManagement.ejs", {
      title: "staff",
      index,
      staff,
    });
  } catch (error) {
    next(error);
  }
};

const getAddStaff = async (req, res) => {
  try {
    const staff = await AdminModel.find();
    res.render("../views/admin/newStaff", { title: "addstaff" });
  } catch (error) {
    next(error);
  }
};

const removeStaffs = async (req, res) => {
  try {
    const staff = await AdminModel.findByIdAndDelete({ _id: req.query.id });
    res.redirect("/admin/stafftable");
  } catch (error) {
    console.log(error);
  }
};

const postAddStaff = async (req, res, next) => {
  try {
    req.session.email = req.body.email;

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newStaff = await AdminModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await newStaff.save().then(() => {
      res.redirect("/admin/stafftable");
    });
  } catch (error) {
    next(error);
  }
};

const getorderManagement = async (req, res, next) => {
  try {
    const orderList = await orderModel
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "product",
          },
        },
      ])
      .sort({ createdAt: -1 });

    res.render("../views/admin/adminOrderManagement", {
      orderList,
    });
  } catch (error) {
    next(error);
  }
};

const orderStatusChanging = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    await orderModel.updateOne(
      { _id: id },
      {
        $set: {
          orderStatus: data.orderStatus,
          paymentStatus: data.paymentStatus,
        },
      }
    );
    res.redirect("/admin/order-management");
  } catch (err) {
    // next(err)
    console.log(err);
  }
};

const dashBoardDataGet = async (req, res) => {
  const FIRST_MONTH = 1;
  const LAST_MONTH = 12;
  const TODAY = new Date();
  const YEAR_BEFORE = new Date(TODAY);
  YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1);
  const MONTHS_ARRAY = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const pipeLine = [
    {
      $match: {
        createdAt: { $gte: YEAR_BEFORE, $lte: TODAY },
      },
    },
    {
      $group: {
        _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year_month": 1 },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        month_year: {
          $concat: [
            {
              $arrayElemAt: [
                MONTHS_ARRAY,
                {
                  $subtract: [
                    { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                    1,
                  ],
                },
              ],
            },
            "-",
            { $substrCP: ["$_id.year_month", 0, 4] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        data: { $push: { k: "$month_year", v: "$count" } },
      },
    },
    {
      $addFields: {
        start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
        end_year: { $substrCP: [TODAY, 0, 4] },
        months1: {
          $range: [
            { $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } },
            { $add: [LAST_MONTH, 1] },
          ],
        },
        months2: {
          $range: [
            FIRST_MONTH,
            { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] },
          ],
        },
      },
    },
    {
      $addFields: {
        template_data: {
          $concatArrays: [
            {
              $map: {
                input: "$months1",
                as: "m1",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [
                      {
                        $arrayElemAt: [
                          MONTHS_ARRAY,
                          { $subtract: ["$$m1", 1] },
                        ],
                      },
                      "-",
                      "$start_year",
                    ],
                  },
                },
              },
            },
            {
              $map: {
                input: "$months2",
                as: "m2",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [
                      {
                        $arrayElemAt: [
                          MONTHS_ARRAY,
                          { $subtract: ["$$m2", 1] },
                        ],
                      },
                      "-",
                      "$end_year",
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      $addFields: {
        data: {
          $map: {
            input: "$template_data",
            as: "t",
            in: {
              k: "$$t.month_year",
              v: {
                $reduce: {
                  input: "$data",
                  initialValue: 0,
                  in: {
                    $cond: [
                      { $eq: ["$$t.month_year", "$$this.k"] },
                      { $add: ["$$this.v", "$$value"] },
                      { $add: [0, "$$value"] },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        data: { $arrayToObject: "$data" },
        _id: 0,
      },
    },
  ];
  const userChart = await UserModel.aggregate(pipeLine);
  const product = await ProductModel.aggregate(pipeLine);
  const orderChart = await orderModel.aggregate(pipeLine);

  res.json({
    userChart,
    product,
    orderChart,
  });
};

const dashBoardOrderStatus = async (req, res, next) => {
  try {
    const orderCounts = await orderModel.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {};
    orderCounts.forEach(({ _id, count }) => {
      counts[_id] = count;
    });
    res.json({
      delivered: counts["delivered"] || 0,
      pending: counts["pending"] || 0,
      outdelivery: counts["out for Delivery"] || 0,
      ship: counts["shipped"] || 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginPage,
  adminhomepageload,
  usersPage,
  productsPage,
  addProductPage,
  addProductPage,
  doLogin,
  doLogout,
  blockUser,
  unblockUser,
  addProduct,
  getCategoryPage,
  postCategoriesPage,
  editProduct,
  unblockCategory,
  blockCategory,
  blockProduct,
  unblockProduct,
  getBnner,
  getCouponPage,
  addCoupn,
  deleteCoupon,
  getCouponEditPage,
  editProducts,
  addBanner,
  blockBanner,
  unblockBanner,
  getCouponDeletPage,
  postEditCoupon,
  getStaffTable,
  getAddStaff,
  postAddStaff,
  removeStaffs,
  getorderManagement,
  orderStatusChanging,
  dashBoardDataGet,
  uploadMiddleware,
  uploadSingleImage,
  productImageEdit,
  dashBoardOrderStatus,
  // homePage,
};
