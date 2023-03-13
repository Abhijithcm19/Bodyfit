// const orderModel = require('../models/oderModel')
// const mongoose = require('mongoose')
// const UserModel = require("../models/userModel");
// const ProductModel = require("../models/productModel");




// // const getUserOrderPage=async(req,res)=>
// // {
// //   try {
// //     let email = req.session.userEmail;

   
// //      const user = await  UserModel.findOne({ email: email });
    
// //         const userId = user._id;
// //         console.log(userId);
    
// //          const orderList = await orderModel.aggregate([
// //          {
// //            $match: {
// //              userId: new mongoose.Types.ObjectId(userId),
// //            },
// //         },
// //           {
// //              $unwind: "$orderItems",
// //           },
// //          {
// //          $lookup: {
// //               from: "products",
// //                 localField: "orderItems.productId",
// //                foreignField: "_id",
// //                as: "product",
// //              },
// //            },
// //           {
// //              $unwind: "$product",
// //            },
// //         ]);


      

// //         res.render("../views/user/userOrder.ejs", {
// //           orderList,orderList, 
         
// //            userData: user,
// //           userId:userId ,
// //         });


// //   } catch (error) {
// //     console.log(error);
// //   }
// // }


// const cancelOrder = async (req, res, next) => {
//     try {
//       const data = req.params.id;
//       await orderModel.updateOne({ _id: data }, { $set: { orderStatus: "cancelled" } })
//       res.redirect("/order-list");
//     } catch (err) {
//       next(err)
//     }
  
//   };




// module.exports = {
//     // getUserOrderPage,
//     cancelOrder


// }