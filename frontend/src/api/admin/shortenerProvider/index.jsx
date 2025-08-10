import API_ENDPOINTS from '@utils/api';

export const shortenerProvider = {
  getAll: async (axiosJWT, params) => {
    return axiosJWT
      .get(API_ENDPOINTS.ADMIN.SHORTENER_PROVIDER.GET_ALL, { params })
      .then((res) => res.data)
      .catch(() => []);
  },
};
