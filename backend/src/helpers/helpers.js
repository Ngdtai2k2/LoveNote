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

  createShortLinkByAPI: async (req, res, apiUrl, apiKey, urlToShorten) => {
    try {
      if (!urlToShorten) {
        return res
          .status(400)
          .json({ message: req.t('validate:missing_url_to_shorten') });
      }

      if (!apiKey) {
        return res
          .status(400)
          .json({ message: req.t('validate:missing_api_key') });
      }

      if (!apiUrl) {
        return res
          .status(400)
          .json({ message: req.t('validate:missing_api_url') });
      }

      const response = await axios.get(
        apiUrl.replace('{api}', apiKey).replace('{url}', urlToShorten)
      );

      if (response.data) {
        return response.data;
      } else {
        return res
          .status(500)
          .json({ message: req.t('message:error_create_short_link') });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: req.t('message:error_create_short_link') });
    }
  },
};

module.exports = helpers;
