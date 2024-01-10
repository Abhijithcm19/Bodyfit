const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/product");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    console.log(file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).array("image", 3);

module.exports = { upload };
