const ROUTES = {
  AUTH: {
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    CHANGE_PASSWORD: '/change-password',
    FORGOT_PASSWORD: '/forgot-password',
    VERIFY_CODE: '/verify-code',
    RESET_PASSWORD: '/reset-password',
  },
  USER: {
    ME: '/me',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
  },
  TASKS: '/tasks',
  VERIFY_TOKEN_TASK: '/verify-token/:token',
  REWARD: '/reward',
  HOME: '/',
  CONTACTS: '/contacts',
  ABOUT: '/about-me',
  PAYMENT: {
    SUCCESS: '/payment/success',
    CANCEL: '/payment/cancel',
  },
  NOT_FOUND: '/404',
};

export default ROUTES;
