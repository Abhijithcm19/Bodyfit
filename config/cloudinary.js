const { config, uploader } = require("cloudinary").v2;
const multer = require("cloudinary-multer");

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.api_secret,
  });
  next();
};

module.exports = {
  cloudinaryConfig,
  uploader,
};
