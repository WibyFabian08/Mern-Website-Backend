const multer = require("multer");
const path = require('path');

// tentukan storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() +  path.extname(file.originalname));
  },
});

// filter file masuk
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const singelUpload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);

module.exports = singelUpload;
