// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Tentukan tempat penyimpanan dan penamaan file gambar
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder penyimpanan file
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // Berikan nama file berdasarkan waktu dan nama asli file
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

// Filter untuk hanya menerima file gambar (PNG, JPG, JPEG)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Buat middleware multer untuk menangani upload file
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

module.exports = upload;
