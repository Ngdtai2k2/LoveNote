const path = require('path');
const { unlink } = require('fs/promises');
require('dotenv').config();

const helpers = {
  trimRequestBody: (body) => {
    Object.keys(body).forEach((key) => {
      if (typeof body[key] === 'string') {
        body[key] = body[key].trim();
      }
    });
  },

  parseBoolean: (value) => {
    return value === 'true' || value === '1'
      ? true
      : value === 'false' || value === '0'
        ? false
        : undefined;
  },

  /**
   * Get absolute path to "public/assets" folder based on project root.
   * If ROOT_PATH env exists, it uses it. Otherwise defaults to /src.
   */
  getAssetsRootPath: () => {
    const rootPath = process.env.ROOT_PATH || 'src';
    return path.resolve(process.cwd(), rootPath, 'public', 'assets');
  },

  /**
   * Convert a full asset URL (http://...) to local file path.
   * @param {string} url
   * @returns {string} full path to local file
   */
  resolveLocalPath: (url) => {
    const server = process.env.SERVER_URL || '';
    const relative = url.replace(`${server}/assets`, '').replace(/^\/+/, '');
    return path.resolve(helpers.getAssetsRootPath(), relative);
  },

  /**
   * Delete file by public asset URL safely.
   * Ignores missing file, throws on other errors.
   * @param {string} url
   */
  safeUnlink: async (url) => {
    const fullPath = helpers.resolveLocalPath(url);

    try {
      await unlink(fullPath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw {
          code: 500,
          messageKey: 'message:file_delete_failed',
          meta: { file: fullPath, reason: err.message },
        };
      }
    }
  },

  buildBooleanFilter: (field, value) => {
    if (value === undefined) return {};
    const val =
      value === 'true' || value === '1'
        ? true
        : value === 'false' || value === '0'
          ? false
          : undefined;
    return val !== undefined ? { [field]: val } : {};
  },

  calcChangeStats: (todayValue, yesterdayValue) => {
    const t = Number(todayValue) || 0;
    const y = Number(yesterdayValue) || 0;

    if (t === 0) return '+0';
    if (t === y) return '+1';
    if (t > y) return `+${t}`;

    const diff = t - y;
    return `${diff}`;
  },
};

module.exports = helpers;
