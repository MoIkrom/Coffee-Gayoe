const cloudinary = require("../config/cloudinary");
const DatauriParser = require("datauri/parser");
const path = require("path");

const uploader = async (req, res, next) => {
  const { body, file } = req;
  if (!file) return next();

  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);
  const filename = `${body.name}`;
  const cloudinaryOpt = {
    // use_filename: true,
    public_id: filename,
    overwrite: true,
    folder: "coffee-gayoe",
  };

  try {
    // const result = await cloudinary.uploader.upload(datauri.content);
    const result = await cloudinary.uploader.upload(datauri.content, cloudinaryOpt);
    req.file = result;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(err).json({ msg: "Internal Server Error" });
  }
};

module.exports = uploader;
