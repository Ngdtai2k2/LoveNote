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
  HOME: '/',
  CONTACTS: '/contacts',
  ABOUT: '/about-me',
  NOT_FOUND: '/404',
};

export default ROUTES;
