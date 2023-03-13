const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema(
    {
     offerType: {
        type:String,
        required:true,
     },
     bannerText:{
        type:String,
        required:true,
     },
     couponName:{
      type:String,
      required:true
  },
     bannerImage:{
        type:String,
        required: true
    },
     banDeleted:{
        type:Boolean,
       default:false
     },
     
    },
    {
      timestamps:true
    }
    
    );

    module.exports = mongoose.model('banner',bannerSchema)