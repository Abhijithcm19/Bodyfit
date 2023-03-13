const mongoose=require('mongoose');
const Adminproduct=require('../models/adminModel');
const userModel=require('../models/userModel')
const productModel=require('../models/productModel')

const orderSchema = new mongoose.Schema({

  userId:{
    type:mongoose.SchemaTypes.ObjectId,
},
    orderItems: [{
      
        productId:{
          type:mongoose.SchemaTypes.ObjectId,  required:true,

      },
      quantity: {
        type: Number,
      },
       
    }],
    orderStatus: {
      type: String,
      default: 'pending'
    },
    paymentStatus: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    itemsPrice: {
      type: Number,
    },
    shippingPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: {
      type: Date
    },
    Qtystatus: {
      type: Boolean,
      default: true
    },

  
    name: {
      type: String,
      require:true
    },

    shop: {
      type: String,
      required:true,
    },

    state: {
      type: String,
      require:true
    },
    city: {
      type: String,
      required:true,
    },
    street: {
      type: String,
      required:true,
    },
   
    code: {
      type: Number,
      required:true,
    },
    mobile: {
      type: Number,
      required:true,
    },
    email: {
      type: String,
      required:true,
    },


    paymentMethod:{type:String},

    order_id:{
      type: String,
    },

    status: {
      type: String,
      required: true,
      default: 'Pending',
    },

  }, {
    timestamps: true
  });
  const order = mongoose.model('order', orderSchema);

module.exports=order; 
