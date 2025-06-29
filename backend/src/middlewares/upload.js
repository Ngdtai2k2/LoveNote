const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadMiddleware = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const userId = req.user?.id || 'temp';
      let basePath = path.join(__dirname, '../public/assets/temp');

      if (file.fieldname === 'images') {
        basePath = path.join(__dirname, `../public/assets/images/${userId}`);
      } else if (file.fieldname === 'file') {
        basePath = path.join(__dirname, `../public/assets/audio/${userId}`);
      }

      fs.mkdirSync(basePath, { recursive: true });
      cb(null, basePath);
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  });

  const limits = {
    fileSize: 10 * 1024 * 1024,
  };

  const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'audio/mpeg'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  };

  return multer({ storage, limits, fileFilter });
};

module.exports = uploadMiddleware;
