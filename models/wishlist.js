const mongoose = require('mongoose');
const {  addToWishlist } = require('../controllers/adminController');

const userModel=require('../models/userModel')
const productModel=require('../models/productModel')



const WishlistSchema=new mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
    },
    
    
    wishlistItems:[{
            productId:{
                type:mongoose.SchemaTypes.ObjectId,  required:true,
            },
           
        }],
     
})
const Wishlist= mongoose.model('Wishlist',WishlistSchema)

module.exports=Wishlist