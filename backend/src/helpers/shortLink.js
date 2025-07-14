const axios = require('axios');

/**
 * Create a short link
 * @param {string} apiUrl
 * @param {string} apiKey - API token
 * @param {string} urlToShorten - Long URL to shorten
 * @returns {Promise<string>} - Shortened URL
 */

const createShortLink = async (apiUrl, apiKey, urlToShorten) => {
  if (!urlToShorten) {
    throw {
      code: 400,
      messageKey: 'validate:missing_url_to_shorten',
    };
  }

  if (!apiKey) {
    throw {
      code: 400,
      messageKey: 'validate:missing_api_key',
    };
  }

  if (!apiUrl) {
    throw {
      code: 400,
      messageKey: 'validate:missing_api_url',
    };
  }

  try {
    const encodedUrl = encodeURIComponent(urlToShorten);
    const finalUrl = apiUrl
      .replace('{api_key}', apiKey)
      .replace('{link}', encodedUrl);

    const response = await axios.get(finalUrl);

    const result = response.data;

    if (result.status !== 'success') {
      throw {
        code: 502,
        messageKey: 'message:shortening_fail',
      };
    }

    return result.shortenedUrl;
  } catch (err) {
    throw {
      code: 500,
      messageKey: 'message:server_error',
    };
  }
};

module.exports = createShortLink;
