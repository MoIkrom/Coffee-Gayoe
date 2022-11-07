const multer = require("multer");
const path = require("path");

// Disk Storage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}${suffix}${ext}`;
    cb(null, filename);
  },
});

const diskUpload = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExt = /jpg | png/;
    if (!allowedExt.test(ext)) return cb(new Error("Invalid file type"), false);
    cb(null, true);
    // return cb(new Error("Invalid file type"));
  },
  limits: { fileSize: 2e6 },
});

// Memory Storage
const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExt = /jpg|png/;
    if (!allowedExt.test(ext)) return cb(new Error("Invalid file type"), false);
    cb(null, true);
    // return cb(new Error("Invalid file type"));
  },
  limits: { fileSize: 2e6 },
});

const errorHandler = (err, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ status: "Upload Error", msg: err.message });
  }
  if (err) {
    return res.status(500).json({ status: "Internal Server Error", msg: err.message });
  }
  console.log("Upload Succes");
  next();
};

module.exports = { diskUpload, memoryUpload, errorHandler };

// =======================================================

// const multer = require("multer");
// const path = require("path");

// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images");
//   },
//   filename: (req, file, cb) => {
//     const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const ext = path.extname(file.originalname);
//     const filename = `${file.fieldname}-${suffix}${ext}`;
//     cb(null, filename);
//   },
// });

// const limit = {
//   fileSize: 2e6,
// };

// const imageOnlyFilter = (req, file, cb) => {
//   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//     cb(null, true);
//   } else {
//     return cb(new Error("Invalid file type"));
//   }
// };

// const imageUpload = multer({
//   storage: imageStorage,
//   limits: limit,
//   fileFilter: imageOnlyFilter,
// });

// module.exports = imageUpload;
