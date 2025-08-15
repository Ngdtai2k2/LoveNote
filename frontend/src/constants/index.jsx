import DEFAULT_AVATAR from '@assets/svg/avatar-default.svg';

const CONSTANTS = {
  SITE_NAME: 'Heartify',
  DEFAULT_AVATAR: DEFAULT_AVATAR,
  ADMIN: 1,
  USER: 0,
  ADMIN_PREFIX: '/admin',
  OPTIONS_ACTIVE: [
    { days: 1, token: 45, gradient: 'from-green-400 to-green-600' },
    { days: 3, token: 105, gradient: 'from-blue-400 to-blue-600' },
    { days: 5, token: 160, gradient: 'from-purple-400 to-purple-600' },
    { days: 7, token: 220, gradient: 'from-pink-400 to-pink-600' },
  ],
  // pagination
  PAGE: 1,
  LIMIT: 6,
};

export default CONSTANTS;
