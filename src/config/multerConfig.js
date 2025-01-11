const multer = require("multer");
const path = require("path");

// Konfigurasi Multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/"); // Tentukan folder penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Ambil ekstensi file
    const fileName = `${Date.now()}-${path.basename(
      file.originalname,
      ext
    )}${ext}`; // Gabungkan timestamp dengan nama file tanpa ekstensi ganda
    cb(null, fileName); // Simpan file dengan nama unik
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(
      new Error("Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."),
      false
    );
  },
}).single("image"); // 'profile_picture' adalah nama field file di form-data

module.exports = { upload };
