const fs = require('fs');
const axios = require('axios');

const helpers = {
  trimRequestBody: (body) => {
    Object.keys(body).forEach((key) => {
      if (typeof body[key] === 'string') {
        body[key] = body[key].trim();
      }
    });
  },
  /**
   * Delete a file and handle errors.
   * @param {string} filePath - The path of the file to delete.
   * @param {string} errorMessage - The error message to log if deletion fails.
   * @param {Function} callback - Optional callback to execute after file deletion.
   */
  deleteFile: (filePath) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return;
      }
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting file:', err.message);
        } else {
          return;
        }
      });
    });
  },
  
  parseBoolean: (value) => {
    return value === 'true' || value === '1'
      ? true
      : value === 'false' || value === '0'
        ? false
        : undefined;
  },
};

module.exports = helpers;
