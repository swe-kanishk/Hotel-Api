const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); // Use original filename
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp' && ext !== '.mp4') {
    return cb(new Error(`Unsupported file type! ${ext}`));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max file size 50MB
  fileFilter: fileFilter,
});

module.exports = upload;
