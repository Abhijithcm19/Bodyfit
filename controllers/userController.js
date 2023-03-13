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
const Razorpay=require("razorpay")
const DataUri = new require("datauri/parser");
const dUri = new DataUri();
const multer = require('multer');
const path = require("path");
const nodemailer = require('nodemailer');
const Wishlist = require("../models/wishlist");
const couponModel = require("../models/couponModel");
const Category = CategoryModel.category;


userErr = "";
passErr = "";

const signupPage = async (req, res, next) => {
  try {
    const session = req.session.user;
    if (session) {
      res.redirect("/");
    } else {
      res.render("../views/user/userSignup");
    }
  } catch (error) {
    next(error);
  }
};

const verifyPage = async (req, res, next) => {
  try {
    res.render("../views/user/otpVerify", {
      title: "Verification",
      login: req.session,
    });
  } catch (error) {
    next(error);
  }
};

const loginPage = async (req, res, next) => {

  try {
 
    if (!req.session.userLogin) {
    

      res.render("../views/user/userLogin", {
        title: "Login",
        login: req.session,
        userErr,
        passErr,
      });
      userErr = "";
      passErr = "";
    } else {
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
};

const getforgotpassmail = (req, res) => {
  email = req.query
  res.render('../views/user/forgotemail', { email })
};

const getOnlyOtp = (req, res) => {
  email = req.query
  res.render('../views/user/forgotpassotp', { email })
};


const getSetPassword = (req, res, next) => {
  try {
    res.render("../views/user/forgotPassword")
  } catch (err) {
    next(err)
  }
};



const emailPost = async (req, res, next) => {

  let email = req.body.email;
  const userEmail = req.body.email;
  const userData = req.body;
  const isUserExist = await UserModel.findOne({ email: userEmail });

  if (isUserExist) {
    otp = Math.floor(100000 + Math.random() * 900000);
    await sendOtp.sendVerifyEmail(email, otp)
      .then(() => {
        res.redirect('/onlyotp');
      }).catch((error) => {
        next(error)
      })
  } else {
    res.render('../views/user/forgotemail', { invalid: "please enter a valid Email", userData })
  }

}


const forgotpasswordverifyotp = async (req, res, next) => {
  try {
    if (req.body.otp == otp) {
      await UserModel.findOneAndUpdate({ email: req.session.email }, { $set: { verified: true } })
        .then(() => {
          otp = "";
          res.redirect('/setpassword')
        })
        .catch((error) => {
          next(error)
        })

    } else {
      return res.redirect('/onlyotp')
    }
  } catch (error) {
    next(error)
  }
}


const 
postSetPassword = async (req, res, next) => {

  try {

    const email = req.body.email
    const password = req.body.password
    const hash = await bcrypt.hash(password, 10)

 
    await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: hash } })
      
      console.log("Enter Renter Page");
    res.render('/user/login')

  } catch (error) {
    next(error);
  }

};


// const home = async (req, res, next) => {
//   try {
//     return res.render("../views/user/userHome", {
//       title: "Home",
//       login: req.session.userLogin,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const home = async (req, res, next) => {
  try {
    const newproduct = await ProductModel.find({});
    res.render("../views/user/userHome", {title: "Home", login: req.session.userLogin, newproduct });
    
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

const doLogout = async (req, res, next) => {
  try {
    req.session.userLogin = false;
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};


const doLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      userErr = "user doesnot exist";
      req.session.userLogin = false;
      return res.redirect("/login");
    }
    if (user.isBlocked) {
      userErr = "sorry user blocked";
      req.session.userLogin = false;
      return res.redirect("/login");
    }
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      passErr = "incorrect password";
      req.session.userLogin = false;
      return res.redirect("/login");
    }
    req.session.username = user.name;
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.userLogin = true;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  console.log(req.body.otp);
  try {
    if (req.body.otp == otp) {
      await UserModel.findOneAndUpdate(
        { email: req.session.email },
        { $set: { verified: true } }
      )
        .then(() => {
          otp = "";
          res.redirect("/");
        })
        .catch((error) => {
          next(error);
        });
    } else {
      console.log("otp doesnt match");
      return res.redirect("/verify-user");
    }
  } catch (error) {
    next(error);
  }
};

const doSignup = async (req, res, next) => {
  try {
    

    req.session.email = req.body.email;
    //  console.log(email);
    console.log(req.body);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await UserModel({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
    });
    console.log(newUser);
    await newUser
      .save()
      .then(() => {
        next();
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/register");
      });
  } catch (error) {
    next(error);
  }
};

const getOtp = async (req, res, next) => {
  // console.log(req.body);
  let email = req.body.email;

  console.log(email);

  otp = Math.floor(100000 + Math.random() * 900000);

  await sendOtp
    .sendVerifyEmail(email, otp)
    .then(() => {
      res.redirect("/otp-Verify");
    })
    .catch((error) => {
      next(error);
    });
};


const forgotresendotp = async (req, res, next) => {
  // console.log(req.body);
  let email = req.body.email;

  console.log(email);

  otp = Math.floor(100000 + Math.random() * 900000);

  await sendOtp
    .sendVerifyEmail(email, otp)
    .then(() => {
      res.redirect("/onlyotp");
    })
    .catch((error) => {
      next(error);
    });
};

const resendotp = async (req, res, next) => {
  // console.log(req.body);
  let email = req.body.email;

  console.log(email);

  otp = Math.floor(100000 + Math.random() * 900000);

  await sendOtp
    .sendVerifyEmail(email, otp)
    .then(() => {
      res.redirect("/otp-Verify");
    })
    .catch((error) => {
      next(error);
    });
};


// resend otp

const resendotppage = async (req, res) => {
  const userId = req.params.user_id;
  const user = await User.findOne({ _id: req.params.user_id });
 const email=user.email

  try {

    let otp;
            otp = Math.floor(Math.random() * 1000000);
            console.log(otp);

            const emailStatus = await sendOtpViaEmail(email, otp, res);
            if (emailStatus) {
              User.findByIdAndUpdate(
                { _id: user._id },
                {
                  $set: {
                    "otp.expiredAt": new Date(Date.now() + 20 * 60 * 1000),
                    "otp.otp": otp,
                  },
                }
              ).then(() => {
                res.redirect("/verifyotp/" + user._id);
              });
            }
      
        else {
          throw new Error("Password is required");
        }
      
 
  } catch (err) {
    console.log("err");
  }
}




// userProfile

const viewProfile = async (req, res, next) => {
  try {
    const email = req.session.userEmail;
    console.log(req.session, "hii");
    let userid = await UserModel.findOne({ email: email });
    const userData = await UserModel.findOne({ _id: userid._id });
    console.log(userData, "userData");
    res.render("../views/user/profile", {
      login: req.session,
      userData: userData,
    });
  } catch (error) {
    next(error);
  }
};

const postusereditProfilePage = async (req, res) => {
  try {
    console.log(req.body.name);
    console.log(req.params.Dataid);

    await UserModel.findByIdAndUpdate(
      { _id: req.params.Dataid },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
        },
      }
    );

    res.redirect("/viewProfile");
  } catch (error) {
    console.log(error.message);
  }
};

const getchangepasswordPage = async (req, res) => {
  res.redirect("/viewProfile");
};

// edit user password

// console.log(user);

const postChangePasswordPage = async (req, res) => {
  let email = req.session.userEmail;
  let currentPassword = req.body.current;
  const user = await UserModel.findOne({ email: email });

  if (user) {
    bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        res.redirect("/change-password");
      }
      if (isMatch) {
        if (req.body.new === req.body.confirm) {
          bcrypt.hash(req.body.new, 10, async (err, hash) => {
            if (err) {
              console.error(err);
              res.redirect("/change-password");
            }
            await UserModel.updateOne(
              { email: email },
              { $set: { password: hash } }
            );
            res.redirect("/change-password");
          });
        } else {
          console.log("New password and confirm password do not match.");
          res.redirect("/change-password");
        }
      } else {
        console.log("Incorrect current password.");
        res.redirect("/change-password");
      }
    });
  } else {
    console.error("User not found in the database.");
    res.redirect("/change-password");
  }
};

// let password=userdatas.password
// console.log(password);

const getusereditProfilePage = async (req, res) => {
  // if (req.session.email) {
  try {
    const id = req.query.id;
    const userData = await UserModel.findById({ _id: id });
    // console.log(req.session.error);
    if (userData) {
      let error = req.session.error;
      req.session.error = null;
      res.render("../views/user/editUserPage", {
        userDatas: userData,
        Dataid: req.query.id,
      });
    }

    // else {
    //   res.redirect("/admin");
    // }
  } catch (error) {
    console.log(error.message);
  }
};

const getProfileAddressPage = async (req, res) => {
  try {
    let email = req.session.userEmail;
    const userData = await UserModel.findOne({ email: email });
 

    res.render("../views/user/useraddressprint.ejs", {
      login: req.session,
      userDatas: userData,
    });
  } catch (error) {
    console.log(error);
  }
};

const postAddressPage = async (req, res) => {

  try {
    let email = req.session.userEmail;
    console.log(email);

    await UserModel.updateOne(
      { email: email },
      {
        $push: {
          addressDetails: {
            Fullname: req.body.name,
            mobile: req.body.mobile,
            company: req.body.company,
            email: req.body.email,
            countryname: req.body.country,
            city: req.body.town,
            state: req.body.state,
            houseaddress: req.body.address,
            postal_code: req.body.zip,
          },
          
        },
      }
    );

    res.redirect("/viewProfile");
  } catch (error) {
    console.error(error);
  }
};

const fetchAddress = async (req, res) => {
  console.log("fetch entering......................");
  const addressId=req.params.userid
  try {
    const addressId = req.params.userid;
    const email = req.session.userEmail;
    const userData = await UserModel.findOne({ email });
    const addressDetails = userData.addressDetails.id(addressId);
    if (!addressDetails) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(addressDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  } 
}

// dissply all product

// const getallproductpage = async (req, res) => {
//   try {
//     const products = await ProductModel.find({});
//     res.render("../views/user/shop.ejs", { products });
//     console.log(products);
//   } catch (error) {
//     console.log(error.message);
//   }
// };




const getallproductpage = async (req, res) => {
  try {
    const perPage = 6;
    const page = parseInt(req.query.page) || 1;
    const sortOption = req.query.sort || 'created_at';
    const categoryData = await CategoryModel.find({ iBlocked: true }, { name: 1 });
    const filter = {};
    const category = req.query.category;
    const searchKeyword = req.query.search || '';
    
    if (category) {
      filter.category = category;
    }
    if (searchKeyword) {
      filter.name = { $regex: new RegExp(searchKeyword, 'i') };
    }

    let sort = {};
    switch (sortOption) {
      case 'low-to-high':
        sort = { price: 1 };
        break;
      case 'high-to-low':
        sort = { price: -1 };
        break;
      case 'name-ascending':
        sort = { productname: 1 };
        break;
      case 'name-descending':
        sort = { productname: -1 };
        break;
      default:
        sort = { created_at: -1 };
        break;
    }

    const countQuery = category ? { ...filter, category } : filter;
    const totalCount = await ProductModel.countDocuments(countQuery);
    const totalPages = Math.ceil(totalCount / perPage);
    const nextPage = (page < totalPages) ? page + 1 : null;
    const prevPage = (page > 1) ? page - 1 : null;

    const products = await ProductModel.find(filter)
      .sort(sort)
      .skip((perPage * (page - 1)))
      .limit(perPage);

    res.render('../views/user/shop.ejs', {
      alldetails: products,
      catData: categoryData,
      totalCount,
      currentPage: page,
      totalPages,
      nextPage,
      prevPage,
      searchKeyword,
      sortby: sortOption,
      selectedCategory: category
    });
  } catch (error) {
    console.log(error.message);
  }
};






// // checkoutpage
// const getCheckoutPage = async (req, res) => {
//   try {
//     const couponData = req.session.couponData;
//     const email = req.session.userEmail;
//     const user = await UserModel.findOne({ email: email });

//     const userId = user._id;
//     const adderror=req.session.error

//     req.session.error=null


//     const cartList = await carts.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $unwind: "$cartItems",
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "cartItems.productId",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       {
//         $unwind: "$product",
//       },
//     ]);
    
//     res.render("../views/user/checkout.ejs", {adderror,
//       cartList: cartList,
//       userData: user,
//       userId:userId ,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


const getCheckoutPage = async (req, res,next) => {
  try {
    const couponData = req.session.couponData;
    const totalAmount = req.session.totalAmount;

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
    res.render("../views/user/checkout.ejs", {
      cartList: cartList,
      userData: user,
      userId: userId,
      couponData: couponData,
       totalAmount: totalAmount
    });
  } catch (error) {
    next(error);
  }
};




const postCheckoutPage = async (req, res,next) => {
  try {
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

    res.render("../views/user/oderSuccess.ejs", {
      cartList: cartList,
      userData: user,
      userId: req.session.userEmail,
    });
  } catch (error) {
    next(error);
  }
};



// const postCheckoutPage = async (req, res) => {
//   try {
//     console.log(req.body)
//     console.log("enter checkout");
//     const email = req.session.userEmail;
//     const user = await UserModel.findOne({ email: email });

//     const userId = user._id;

//     const cartList = await carts.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $unwind: "$cartItems",
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "cartItems.productId",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       {
//         $unwind: "$product",
//       },
//     ]);
//     res.render("../views/user/oderSuccess.ejs", {
//       cartList: cartList,
//       userData: user,
//       userId: req.session.userEmail,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };



//     console.log("item ending");
//     const totalAmount = cartList.reduce((total, item) => {
//       return total + item.cartItems.qty * item.product.price;
//     }, 0);
//     //  con

//     console.log(req.body.paymentMethod);

//     const order = new orderModel({
//       userId: userId,
      

//       orderItems: cartList.map((item) => ({
//         productId: item.product._id,
//         quantity: item.cartItems.qty,
//       })),
//       totalPrice: totalAmount,
//       name: req.body.name,
//       shop: req.body.shop,
//       state: req.body.state,
//       city: req.body.city,
//       street: req.body.street,
//       code: req.body.code,
//       mobile: req.body.mobile,
//       email: req.body.email,
//       paymentMethod:req.body.paymentMethod
//     });
//     await order.save();
    
//     res.render("../views/user/oderSuccess.ejs", {
//       cartList: cartList,
//       userData: user,
//       userId: req.session.userEmail,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };



const postOrderpage=async(req,res)=>
{
 const amount=req.body.amount
 console.log(amount);

const razorpayInstance = new Razorpay({ 
// key_id:process.env.KEY_ID,
key_id:"rzp_test_jbSlDDRu4vCwER",
key_secret:"87NItBHagsU0z1hoL7yvVRQv"

})
razorpayInstance.orders.create({

amount:amount*100,
  currency:"INR"
},(err,order)=>{
  console.log(order)
  res.json({success:true,order,amount})
})
}


const paymentConfirm = async (req, res) => {
  console.log("data emeeeeeeeeeeeeeee");
  const userId = req.body.userId;

  console.log(userId + "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkky");

  try {
    const razorpayInstance = new Razorpay({
      key_id: "rzp_test_jbSlDDRu4vCwER",
      key_secret: "87NItBHagsU0z1hoL7yvVRQv",
    });
    const order = await razorpayInstance.orders.fetch(
      req.body.response.razorpay_order_id
    );
    if (order.status === "paid") {
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
      console.log(cartList + "hhhhhhhhhhhhhhhhhhhhhhhhhy");

      console.log(req.body);

      const newOrder = new orderModel({
        orderItems: cartList.map((item) => ({
          productId: item.product._id,
          quantity: item.cartItems.qty,
        })),
        products: req.session.orderedItems,
        totalPrice: order.amount / 100,
        order_id: req.body.response.razorpay_order_id,
        name: req.body.name,
        shop: req.body.shop,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        code: req.body.code,
        mobile: req.body.mobile,
        email: req.body.email,
        paymentMethod: "online",
      });

      newOrder
        .save()
        .then(async (data) => {
          req.session.orderedItems = null;
          res.json({ status: true, message: "order placed" });
          await cartmodel.deleteMany({ userId: userId });
        })
        .catch(() => {
          res.json({
            status: false,
            message: "order not placed",
          });
        });
    } else {
      res.json({
        status: false,
        message: "order not placed",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: "order not placed",
    });
  }
};



const postCashonDelivery = async (req, res) => {
  try {
    const userId = req.query.userId;
 
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

    let orderId = 'bodyfitC00001';

    const newOrder = new orderModel({
      orderItems: cartList.map((item) => ({
        productId: item.product._id,
        quantity: item.cartItems.qty,
      })),
      products: req.session.orderedItems,
      totalPrice: req.body.amount,
      order_id: orderId, // use the generated orderId here
      name: req.body.name,
      shop: req.body.shop,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      code: req.body.code,
      mobile: req.body.mobile,
      email: req.body.email,
      paymentMethod: "COD",
    });

    await newOrder.validate();
    await newOrder.save();
   
    req.session.orderedItems = null;
    await carts.deleteMany({ userId: userId });

    res.status(200).send({ orderId });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      req.session.error = "Please fill in the form";

      console.log( req.session.error);
      return res.status(400).send(`<script>alert('${req.session.error}');</script>`);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
};












const codSuccessPage=async(req,res)=>{
  try {
    
    res.render("../views/user/oderSuccess.ejs")
  } catch (error) {
    console.log("error");
  }
}

// const getUserOrderPage=async(req,res)=>
// {
//   try {
//     let email = req.session.userEmail;

   
//      const user = await  UserModel.findOne({ email: email });
    
//         const userId = user._id;
//         console.log(userId);
    
//          const orderList = await orderModel.aggregate([
//          {
//            $match: {
//              userId: new mongoose.Types.ObjectId(userId),
//            },
//         },
//           {
//              $unwind: "$orderItems",
//           },
//          {
//          $lookup: {
//               from: "products",
//                 localField: "orderItems.productId",
//                foreignField: "_id",
//                as: "product",
//              },
//            },
//           {
//              $unwind: "$product",
//            },
//         ]);


      

//         res.render("../views/user/userOrder.ejs", {
//           orderList,orderList, 
         
//            userData: user,
//           userId:userId ,
//         });


//   } catch (error) {
//     console.log(error);
//   }
// }

const getUserOrderPage = async (req, res, next) => {
  try {
  
    let email = req.session.userEmail;
    const userData = await UserModel.findOne({ email: email });
   
    const userId = userData._id;
    

    const orderList = await orderModel.aggregate([
      {
         $unwind: "$orderItems",
      },
     {
     $lookup: {
          from: "products",
            localField: "orderItems.productId",
           foreignField: "_id",
           as: "product",
         },
       },
      {
         $unwind: "$product",
       },
    ]);
    res.render("../views/user/userOrder.ejs", {
      login: req.session,
      userDatas: userData,orderList, 
      Dataid: userId,
    });
  } catch (error) {
    next(error);
  }
};



const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;

    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "Pending") {
      throw new Error("Order cannot be cancelled");
    }

    order.status = "Cancelled";
    await order.save();

    res.redirect("/order-list");
  } catch (error) {
    next(error);
  }
};

// const couponcheck = async (req, res , next) => {
//   try {
//     const couponCode = req.body.couponCode;
//     console.log(couponCode);

//     const user = await UserModel.findOne({ email: req.session.userEmail });
//     const userId = user._id;


//     const couponUsed = await couponModel.findOne({
//       couponCode: couponCode,
//       user: { $elemMatch: { userId: userId } }
//     });

//     if (couponUsed) {
//       res.status(400).send("Coupon has already been used.");
//     } else {


//       const coupon = await couponModel.findOne({
//         couponCode: couponCode,
//       });

//       res.status(200).json(coupon);
//     }

//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal server error.");
//     next(error)
//   }
// };




const couponcheck = async (req, res,next) => {
  try {
    const couponCode = req.body.couponCode;
    const total_amount = req.body.total_amount;
    console.log(total_amount);


    const user = await UserModel.findOne({ email: req.session.userEmail });
    const userId = user._id;
    const couponUsed = await couponModel.findOne({
      couponCode: couponCode,
      user: { $elemMatch: { userId: userId } },
    });

    if (couponUsed) {
      res.status(400).send("Coupon has already been used.");
    } else {
      const coupon = await couponModel.findOne({
        couponCode: couponCode,
      });

      res.status(200).json(coupon);
    }
  } catch (error) {
    next(error);
  }
};



const userAddressEdit = async (req, res) => {
  try {
    
    const addressId = req.query.addressId;
    console.log(addressId+"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    const email = req.session.userEmail;
    const userData = await UserModel.findOne({ email: email });

    const address = userData.addressDetails.find(
      (address) => address._id.toString() === addressId
    );

    res.render("../views/user/editAddress.ejs", {
      login: req.session,
      address: address,
    });
  } catch (error) {
    console.log(error);
  }
};


const updateAddressPage = async (req, res) => {
  const addressid = req.params.id;
 

  try {
    const email = req.session.userEmail;
    await UserModel.updateOne(
      { email: email, "addressDetails._id": addressid },
      {
        $set: {
          "addressDetails.$.Fullname": req.body.name,
          "addressDetails.$.mobile": req.body.mobile,
          "addressDetails.$.company": req.body.company,
          "addressDetails.$.email": req.body.email,
          "addressDetails.$.countryname": req.body.country,
          "addressDetails.$.city": req.body.town,
          "addressDetails.$.state": req.body.state,
          "addressDetails.$.houseaddress": req.body.address,
          "addressDetails.$.postal_code": req.body.zip,
        },
      }
    );
    res.redirect("/profile-address");
  } catch (error) {
    console.error(error);
  }
};


const userAddressDelete = async (req, res) => {
  try {
  const id = req.query.id;
  await UserModel.updateOne(
  {},
  { $pull: { addressDetails: { _id: id } } }
  );
  console.log("Address deleted successfully.");
  res.status(200).redirect("/profile-address");
  } catch (error) {
  console.error(error);
  res.status(500).send("Error deleting address");
  }
  };




module.exports = {
  home,
  doLogout,
  verifyUser,
  doSignup,
  loginPage,
  signupPage,
  verifyPage,
  getOtp,
  forgotresendotp,
  resendotp,
  doLogin,
  viewProfile,
  getallproductpage,
  postusereditProfilePage,
  getchangepasswordPage,
  getusereditProfilePage,
  postAddressPage,
  postChangePasswordPage,
  getProfileAddressPage,
  getCheckoutPage,
  fetchAddress,
  postCheckoutPage,
  couponcheck,
  getforgotpassmail,
  getOnlyOtp,
  getSetPassword,
  emailPost,
  forgotpasswordverifyotp,
  postSetPassword,
  userAddressEdit,
  updateAddressPage,
  userAddressDelete,
  postOrderpage,
  paymentConfirm,
  postCashonDelivery,
  codSuccessPage,
  getUserOrderPage,
  resendotppage,
  cancelOrder


};
