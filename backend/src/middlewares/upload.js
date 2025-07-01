const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadMiddleware = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.user?.id || 'temp';
      let basePath;

      switch (file.fieldname) {
        case 'avatar':
          basePath = path.join(__dirname, `../public/assets/avatars/${userId}`);
          break;
        case 'image':
          basePath = path.join(__dirname, `../public/assets/images/${userId}`);
          break;
        case 'audio':
          basePath = path.join(__dirname, `../public/assets/audio/${userId}`);
          break;
        default:
          basePath = path.join(__dirname, '../public/assets/temp');
          break;
      }

      fs.mkdirSync(basePath, { recursive: true });
      cb(null, basePath);
    },

    filename: (req, file, cb) => {
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
