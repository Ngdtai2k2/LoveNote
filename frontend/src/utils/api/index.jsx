const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: `${BASE_URL}/auth/sign-in`,
    SIGN_UP: `${BASE_URL}/auth/sign-up`,
    SIGN_OUT: `${BASE_URL}/auth/sign-out`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
    ME: `${BASE_URL}/auth/me`,
  },
  USER: {
    UPDATE: (id) => `${BASE_URL}/user/${id}`,
  },
  PRODUCT: {
    GET_ALL: `${BASE_URL}/product`,
  },
  BANNER: {
    GET_ALL: `${BASE_URL}/banner`,
  },
  WEB_CONFIG: {
    GET_ALL: `${BASE_URL}/web-config`,
  },
};

export default API_ENDPOINTS;
