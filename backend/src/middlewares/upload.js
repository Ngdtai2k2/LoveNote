const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, callBack) => {
      const imageTypes = /jpg|jpeg|png|gif/;
      const audioTypes = /mp3/;

      const ext = path.extname(file.originalname).toLowerCase();

      let baseDir = '';
      if (imageTypes.test(ext)) {
        baseDir = path.join(__dirname, '../assets/avatar', folder);
      } else if (audioTypes.test(ext)) {
        baseDir = path.join(__dirname, '../assets/audio', folder);
      } else {
        return callBack(new Error('Unsupported file type'), false);
      }

      fs.mkdirSync(baseDir, { recursive: true });
      callBack(null, baseDir);
    },
    filename: (req, file, callBack) => {
      const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      callBack(null, uniqueName);
    },
  });
};

const upload = (folder) => {
  const storage = createStorage(folder);

  const fileFilter = (req, file, callBack) => {
    const allowedImageTypes = /jpg|jpeg|png|gif/;
    const allowedAudioTypes = /mp3/;

    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedImageTypes.test(ext) && allowedImageTypes.test(mime)) {
      return callBack(null, true);
    }
    if (allowedAudioTypes.test(ext) && mime === 'audio/mpeg') {
      return callBack(null, true);
    }

    return callBack(new Error('Only image and MP3 files are allowed!'), false);
  };

  return multer({ storage: storage, fileFilter: fileFilter });
};

module.exports = upload;
