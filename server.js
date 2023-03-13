const createError = require("http-errors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const logger = require("morgan");
const db = require("./config/connection");
const dotenv = require("dotenv");
const { cloudinaryConfig } = require("./config/cloudinary");
const PORT = process.env.PORT || 3000;
dotenv.config();
db();

const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/user");


const multer = require("multer");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(cloudinaryConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

//session setup
const oneHour = 1000*60*60;
app.use(session({
    secret: "key",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: oneHour}
}))




// Cache-Control
app.use((req,res,next)=>{
  res.set('Cache-Control','no-store');
  next();
})


app.use("/admin", adminRouter);
app.use("/", usersRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});




// module.exports = app;
app.listen(PORT, () => {
  console.log("SERVER START");
});
