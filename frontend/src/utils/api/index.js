const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: `${BASE_URL}/auth/sign-in`,
    SIGN_UP: `${BASE_URL}/auth/sign-up`,
    SIGN_OUT: `${BASE_URL}/auth/sign-out`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
    ME: `${BASE_URL}/auth/me`,
  },
  PRODUCT: {
    GET_ALL: `${BASE_URL}/product/all`,
  },
};

export default API_ENDPOINTS;
