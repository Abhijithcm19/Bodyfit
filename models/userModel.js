const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;


const addressSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    mobile : {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    address:{
        type:String,
        required: true
    },
});



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  addressDetails:[
    {
     Fullname:{type:String},
  
     email:{type:String},
  
     mobile:{type:Number},
  
     countryname:{type:String},
  
     city:{type:String},
     
     company:{type:String},
  
     state:{type:String},
  
     postal_code:{type:Number},
  
     houseaddress:{
        type:String
     },
    }
  ],



  status: {
    type: Boolean,
    default: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
