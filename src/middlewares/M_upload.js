const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ".");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${suffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const limit = {
  fileSize: 2e6,
};

const imageOnlyFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  const allowedExt = /jpeg|jpg|png/;
  if (!allowedExt.test(extName)) return cb(new Error("Invalid Extension. Only Use JPG/PNG"), false);
  cb(null, true);
};

const imageUpload = multer({
  storage: imageStorage,
  limits: limit,
  fileFilter: imageOnlyFilter,
});

/*const handlingUpload = async (req, res, next) => {
  await upload(req, res, (err) => {
    if(err instanceof multer.MulterError){
      return helperWraper.res(res, 401, err.message, null)};
      if(err){
        return helperWraper.res(res, 401, err.message, null);
      }
      return next();
    });
  };*/

module.exports = imageUpload;

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images");
//   },
//   filename: (req, file, cb) => {
//     const suffix = `${Date.now()}-${Math.round(Math.random() * 1e3)}`;
//     const ext = path.extname(file.originalname);
//     const fileName = `${file.fieldname}-${suffix}${ext}`;
//     cb(null, fileName);
//   },
// });

// const upload = multer({
//   storage,
// });

// module.exports = upload;
