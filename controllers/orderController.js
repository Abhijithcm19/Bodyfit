// const orderModel = require('../models/oderModel')
// const mongoose = require('mongoose')
// const UserModel = require("../models/userModel");
// const ProductModel = require("../models/productModel");
// const Razorpay=require("razorpay")



// const postOrderpage=async(req,res)=>
// {
//  const amount=req.body.amount
//  console.log(amount);

// const razorpayInstance = new Razorpay({ 
// // key_id:process.env.KEY_ID,
// key_id:"rzp_test_jbSlDDRu4vCwER",
// key_secret:"87NItBHagsU0z1hoL7yvVRQv"

// })
// razorpayInstance.orders.create({

// amount:amount*100,
//   currency:"INR"
// },(err,order)=>{
//   console.log(order)
//   res.json({success:true,order,amount})
// })
// }


// const paymentConfirm = async (req, res) => {
//     console.log("data emeeeeeeeeeeeeeee");
//     const userId = req.body.userId;
  
//     console.log(userId + "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkky");
  
//     try {
//       const razorpayInstance = new Razorpay({
//         key_id: "rzp_test_jbSlDDRu4vCwER",
//         key_secret: "87NItBHagsU0z1hoL7yvVRQv",
//       });
//       const order = await razorpayInstance.orders.fetch(
//         req.body.response.razorpay_order_id
//       );
//       if (order.status === "paid") {
//         const cartList = await carts.aggregate([
//           {
//             $match: {
//               userId: new mongoose.Types.ObjectId(userId),
//             },
//           },
//           {
//             $unwind: "$cartItems",
//           },
//           {
//             $lookup: {
//               from: "products",
//               localField: "cartItems.productId",
//               foreignField: "_id",
//               as: "product",
//             },
//           },
//           {
//             $unwind: "$product",
//           },
//         ]);
//         console.log(cartList + "hhhhhhhhhhhhhhhhhhhhhhhhhy");
  
//         console.log(req.body);
  
//         const newOrder = new orderModel({
//           orderItems: cartList.map((item) => ({
//             productId: item.product._id,
//             quantity: item.cartItems.qty,
//           })),
//           products: req.session.orderedItems,
//           totalPrice: order.amount / 100,
//           order_id: req.body.response.razorpay_order_id,
//           name: req.body.name,
//           shop: req.body.shop,
//           state: req.body.state,
//           city: req.body.city,
//           street: req.body.street,
//           code: req.body.code,
//           mobile: req.body.mobile,
//           email: req.body.email,
//           paymentMethod: "online",
//         });
  
//         newOrder
//           .save()
//           .then(async (data) => {
//             req.session.orderedItems = null;
//             res.json({ status: true, message: "order placed" });
//             await cartmodel.deleteMany({ userId: userId });
//           })
//           .catch(() => {
//             res.json({
//               status: false,
//               message: "order not placed",
//             });
//           });
//       } else {
//         res.json({
//           status: false,
//           message: "order not placed",
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       res.json({
//         status: false,
//         message: "order not placed",
//       });
//     }
//   };



//   const postCashonDelivery = async (req, res) => {
//     try {
//       const userId = req.query.userId;
   
//       const cartList = await carts.aggregate([
//         {
//           $match: {
//             userId: new mongoose.Types.ObjectId(userId),
//           },
//         },
//         {
//           $unwind: "$cartItems",
//         },
//         {
//           $lookup: {
//             from: "products",
//             localField: "cartItems.productId",
//             foreignField: "_id",
//             as: "product",
//           },
//         },
//         {
//           $unwind: "$product",
//         },
//       ]);
  
//       let orderId = 'bodyfitC00001';
  
//       const newOrder = new orderModel({
//         orderItems: cartList.map((item) => ({
//           productId: item.product._id,
//           quantity: item.cartItems.qty,
//         })),
//         products: req.session.orderedItems,
//         totalPrice: req.body.amount,
//         order_id: orderId, // use the generated orderId here
//         name: req.body.name,
//         shop: req.body.shop,
//         state: req.body.state,
//         city: req.body.city,
//         street: req.body.street,
//         code: req.body.code,
//         mobile: req.body.mobile,
//         email: req.body.email,
//         paymentMethod: "COD",
//       });
  
//       await newOrder.validate();
//       await newOrder.save();
     
//       req.session.orderedItems = null;
//       await carts.deleteMany({ userId: userId });
  
//       res.status(200).send({ orderId });
//     } catch (error) {
//       if (error.name === 'ValidationError') {
//         const errors = Object.values(error.errors).map((err) => err.message);
//         req.session.error = "Please fill in the form";
  
//         console.log( req.session.error);
//         return res.status(400).send(`<script>alert('${req.session.error}');</script>`);
//       } else {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//       }
//     }
//   };


//   const codSuccessPage=async(req,res)=>{
//     try {
      
//       res.render("../views/user/oderSuccess.ejs")
//     } catch (error) {
//       console.log("error");
//     }
//   }


// module.exports = {
//     postOrderpage,
//     paymentConfirm,
//     postCashonDelivery,
//     codSuccessPage



// }