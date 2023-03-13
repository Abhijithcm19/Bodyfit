const mongoose=require('mongoose');
const adminSchema = new mongoose.Schema({
  name:  String,
  email: String,
  password:   String,
  admindelete: {
    type: Boolean,
    default: false,
  }
});
const Admin = mongoose.model('Admin', adminSchema);

module.exports=Admin;