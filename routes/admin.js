const express = require("express");
const router = express.Router();
const Login = require("../middleware/isLogin");
const session = require("express-session");
const { upload } = require("../multer&nodemailer/multer");
const controller = require("../controllers/adminController");
const { render } = require("ejs");
let adminsess = Login.adminLogin;


//GET
router.get("/", adminsess, controller.adminhomepageload);
router.get("/login", controller.loginPage);
router.get("/logout", controller.doLogout);
router.get("/home", controller.usersPage);
router.get("/product", adminsess, controller.productsPage);
router.get("/addproduct", adminsess, controller.addProductPage);
router.get("/categories", adminsess, controller.getCategoryPage);
router.get("/products/add", adminsess, controller.addProductPage);
router.get("/users", adminsess, controller.usersPage);
router.get("/blockUser/:id", adminsess, controller.blockUser);
router.get("/unBlockUser/:id", adminsess, controller.unblockUser);
router.get("/products-edit", controller.editProduct);
router.post("/products-Edit", controller.editProducts);
router.post(
  "/image-edit/:public_id/:product_id",
  adminsess,
  controller.uploadSingleImage,
  controller.productImageEdit
);
router.get("/blockCategory/:id", adminsess, controller.blockCategory);
router.get("/unblockCategory/:id", adminsess, controller.unblockCategory);
router.get("/blockProduct/:id", adminsess, controller.blockProduct);
router.get("/unblockProduct/:id", adminsess, controller.unblockProduct);
router.get("/coupon", adminsess, controller.getCouponPage);
router.get("/deleteCoupon/:id", adminsess, controller.deleteCoupon);
router.get("/coupon/editcoupon", adminsess, controller.getCouponEditPage);
router.get("/coupon-Delete", adminsess, controller.getCouponDeletPage);
router.get("/unblockBanner/:id", adminsess, controller.unblockBanner);
router.get("/blockBanner/:id", adminsess, controller.blockBanner);
router.get("/stafftable", adminsess, controller.getStaffTable);
router.get("/stafftable/addstaff", adminsess, controller.getAddStaff);
router.get("/staffremove", adminsess, controller.removeStaffs);
router.get("/order-management", adminsess, controller.getorderManagement);
router.get("/banner", adminsess, controller.getBnner);
router.get("/get-month-wise-data", adminsess, controller.dashBoardDataGet);
router.get("/get-order-status", controller.dashBoardOrderStatus);

//POST
router.post("/signin", controller.doLogin);
router.post("/coupon/editcoupon", adminsess, controller.postEditCoupon);
router.post("/add-categories", controller.postCategoriesPage);
router.post("/products/add-product",adminsess,controller.uploadMiddleware,controller.addProduct);
// router.post('/editimage/:id/:imageId',adminsess,upload.single('images'),controller.imageEdit);
router.post("/addCoupon", adminsess, controller.addCoupn);
router.post("/addBanner", upload, adminsess, controller.addBanner);

router.post("/stafftable/add-staff", adminsess, controller.postAddStaff);
router.post("/order-statuschange/:id", adminsess,controller.orderStatusChanging
);

module.exports = router;
