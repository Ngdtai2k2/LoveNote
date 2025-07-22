const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    SIGN_OUT: '/auth/sign-out',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    CHANGE_PASSWORD: (id) => `/auth/change-password/${id}`,
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_CODE: '/auth/verify-code',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    UPDATE: (id) => `/user/${id}`,
  },
  PRODUCT: {
    GET_ALL: '/product',
    GET_BY_SLUG: (slug) => `/product/${slug}`,
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
    ACTIVE: '/site/active',
  },
  CONTACT: {
    CREATE: '/contact',
  },
  TASK: {
    CREATE: '/task',
    VERIFY_TOKEN: (token) => `/task/verify/${token}`,
    CHECK_TOKEN: (token) => `/task/check/${token}`,
  },
  SHORTENER_PROVIDER: {
    GET_BY_USER: '/shortener-provider/me',
  },
  VOUCHERS: {
    GET_TEMPLATE: (type) => `/voucher/template${type ? `?type=${type}` : ''}`,
    GET_VOUCHER_REDEEM_BY_USER: (isUsed) =>
      `/voucher/redeem/me${isUsed ? `?is_used=${isUsed}` : ''}`,
    REDEEM: '/voucher/redeem',
    CHECK: (code) => `/voucher/check/${code}`,
  },
  PAYMENT: {
    CREATE_LINK: '/payos/create-payment-link',
    CANCEL_LINK: '/payos/cancel-payment',
  },
  TRANSACTION: {
    GET_BY_USER: '/transaction/me',
  },
};

export default API_ENDPOINTS;
