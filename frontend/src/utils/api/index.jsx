const withPrefix = (prefix, routes) => {
  return Object.fromEntries(
    Object.entries(routes).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, `${prefix}${value}`];
      }
      if (typeof value === 'function') {
        return [key, (...args) => `${prefix}${value(...args)}`];
      }
      if (typeof value === 'object' && value !== null) {
        return [key, withPrefix(prefix, value)];
      }
      return [key, value];
    })
  );
};

const API_ENDPOINTS = {
  AUTH: withPrefix('/auth', {
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    SIGN_OUT: '/sign-out',
    REFRESH_TOKEN: '/refresh-token',
    ME: '/me',
    CHANGE_PASSWORD: (id) => `/change-password/${id}`,
    FORGOT_PASSWORD: '/forgot-password',
    VERIFY_CODE: '/verify-code',
    RESET_PASSWORD: '/reset-password',
  }),
  USER: withPrefix('/user', {
    UPDATE: (id) => `/${id}`,
  }),
  PRODUCT: withPrefix('/product', {
    GET_ALL: '',
    GET_BY_SLUG: (slug) => `/${slug}`,
  }),
  BANNER: withPrefix('/banner', {
    GET_ALL: '',
  }),
  WEB_CONFIG: withPrefix('/web-config', {
    GET_ALL: '',
  }),
  USER_SITES: withPrefix('/site', {
    GET_BY_USER: '/me',
    CREATE: '/configs',
    GET_CONFIGS: '/configs',
    CHECK_SLUG: '/check',
    DELETE_CONFIGS: (id) => `/configs/${id}/delete`,
    ACTIVE: '/active',
  }),
  CONTACT: withPrefix('/contact', {
    CREATE: '',
  }),
  TASK: withPrefix('/task', {
    CREATE: '',
    VERIFY_TOKEN: (token) => `/verify/${token}`,
    CHECK_TOKEN: (token) => `/check/${token}`,
  }),
  SHORTENER_PROVIDER: withPrefix('/shortener-provider', {
    GET_BY_USER: '/me',
  }),
  VOUCHERS: withPrefix('/voucher', {
    GET_TEMPLATE: (type) => `/template${type ? `?type=${type}` : ''}`,
    GET_VOUCHER_REDEEM_BY_USER: (isUsed) => `/redeem/me${isUsed ? `?is_used=${isUsed}` : ''}`,
    REDEEM: '/redeem',
    CHECK: (code) => `/check/${code}`,
  }),
  PAYMENT: withPrefix('/payos', {
    CREATE_LINK: '/create-payment-link',
    CANCEL_LINK: '/cancel-payment',
  }),
  TRANSACTION: withPrefix('/transaction', {
    GET_BY_USER: '/me',
  }),
  ADMIN: {
    STATS: withPrefix('/admin/stats', {
      USERS: '/users',
      SITES: '/sites',
      REVENUE: '/revenue',
      SUMMARY: '/summary',
      USER_SITES: '/user-sites',
      TRANSACTION: '/transaction',
    }),
    USERS: withPrefix('/admin/users', {
      ALL_USERS: '',
    }),
  },
};

export default API_ENDPOINTS;
