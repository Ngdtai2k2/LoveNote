const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to create the storage configuration
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, callBack) => {
      const dir = path.join(__dirname, '../public/images', folder);
      fs.mkdirSync(dir, { recursive: true }); // Ensure the directory exists
      callBack(null, dir); // Set the destination folder
    },
    filename: (req, file, callBack) => {
      // Create a unique filename
      callBack(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); 
    }
  });
};

// Function to create the upload middleware with file type validation
const upload = (folder) => {
  const storage = createStorage(folder);

  const fileFilter = (req, file, callBack) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return callBack(null, true);
    } else {
      return callBack(new Error('Only image files are allowed!'), false);
    }
  };

  return multer({ storage: storage, fileFilter: fileFilter });
};

module.exports = upload;
