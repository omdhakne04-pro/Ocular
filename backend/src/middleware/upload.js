const multer = require('multer');

// Configure memory storage so image buffer is processed in RAM without writing to disk
const storage = multer.memoryStorage();

// Allowed MIME types for computer vision inspection
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Unsupported file type: ${file.mimetype}. Please upload a JPEG, PNG, or WEBP image.`),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max limit
  },
  fileFilter,
});

module.exports = upload;
