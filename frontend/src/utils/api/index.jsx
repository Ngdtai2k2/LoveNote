const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    SIGN_OUT: '/auth/sign-out',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
  },
  USER: {
    UPDATE: (id) => `/user/${id}`,
  },
  PRODUCT: {
    GET_ALL: '/product',
  },
  BANNER: {
    GET_ALL: '/banner',
  },
  WEB_CONFIG: {
    GET_ALL: '/web-config',
  },
  USER_SITES: {
    GET_BY_USER: '/site/me',
    CREATE: '/site/configs',
    GET_CONFIGS: '/site/configs',
    CHECK_SLUG: '/site/check',
    DELETE_CONFIGS: (id) => `/site/configs/${id}/delete`,
  },
};

export default API_ENDPOINTS;
