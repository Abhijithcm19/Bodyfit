const { response } = require("express");
const express = require("express");
const router = express.Router();
const session = require("express-session");

const controller = require("../controllers/userController");

const cartcontroller = require("../controllers/cartController");

const wishlistcontroller = require("../controllers/wishlistController");

const ordercontroller = require("../controllers/orderController");
const salesReport =require("../multer&nodemailer/export")

const { noSession, userLogin } = require("../middleware/isLogin");




router.get("/", controller.home);

router.get("/login", controller.loginPage);

router.get("/signup", noSession, controller.signupPage);

router.get("/forgotpass", controller.getforgotpassmail);

router.post("/emailpost", controller.emailPost);

router.get("/onlyotp", controller.getOnlyOtp);

router.post("/forgotpasswordverify", controller.forgotpasswordverifyotp);

router.get("/setpassword", controller.getSetPassword);

router.post("/postsetpassword", controller.postSetPassword);

router.post("/forgotresendotp", controller.forgotresendotp);

router.post("/resendotp", controller.resendotp);

router.get("/otp-Verify", controller.verifyPage);

router.get("/logout", controller.doLogout);

router.get("/register", controller.getOtp);

router.post("/register", controller.doSignup);

router.post("/register", controller.getOtp);

router.post("/signin", controller.doLogin);

router.post("/verify-user", controller.verifyUser);

router.get("/viewProfile", userLogin, controller.viewProfile);

router.get("/edit-profile", userLogin, controller.getusereditProfilePage);

router.get("/profile-address", userLogin, controller.getProfileAddressPage);

router.post("/address", controller.postAddressPage);

router.post("/user_profiles/:Dataid",userLogin,controller.postusereditProfilePage);

router.get("/change-Password", userLogin, controller.getchangepasswordPage);

router.post("/change-Password", userLogin, controller.postChangePasswordPage);

router.get("/shop", controller.getallproductpage);

router.get("/cart", userLogin, cartcontroller.viewCartPage);

router.post("/viewCart", userLogin, cartcontroller.addToCart);

router.put("/removecart", cartcontroller.removeCartItemPage);

router.put("/increment-decrement-count/:type", cartcontroller.postCartIncDec);

router.get("/shop/productdetails/:id", cartcontroller.getshopdetails);

router.get("/getAddressDetails/:userid", controller.fetchAddress);

router.get("/checkout", userLogin, controller.getCheckoutPage);

router.post("/checkoutn", userLogin, controller.postCheckoutPage);

router.post("/couponcheck", userLogin, controller.couponcheck);

router.post('/order',userLogin,controller.postOrderpage)

router.post("/cashon-delivery",userLogin,controller.postCashonDelivery)

router.get("/order-list", userLogin,controller.getUserOrderPage);

router.post("/cancel-order",userLogin, controller.cancelOrder);

router.post('/confirm-order',userLogin,controller.paymentConfirm)

router.get("/exportorder", salesReport.exportorder);

router.get("/addressedit", controller.userAddressEdit);

router.post("/update-address/:id", controller.updateAddressPage);

router.get("/address-delete", controller.userAddressDelete);

router.get("/wishlist",userLogin, wishlistcontroller.displayWishlist);

router.post("/abc",userLogin,wishlistcontroller.addToWishlist);




router.get("/removeWishlist", wishlistcontroller.removeWishlist);


router.get("/success-page",controller.codSuccessPage)







module.exports = router;
