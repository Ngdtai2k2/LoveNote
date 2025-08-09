import API_ENDPOINTS from '@utils/api';

export const statsAPI = {
  summary: (axiosJWT) =>
    axiosJWT
      .get(API_ENDPOINTS.ADMIN.STATS.SUMMARY)
      .then((res) => res.data)
      .catch(() => []),

  userSites: async (axiosJWT, params) => {
    const res = await axiosJWT
      .get(API_ENDPOINTS.ADMIN.STATS.USER_SITES, { params })
      .catch(() => []);
    return res?.data || [];
  },

  transaction: async (axiosJWT, params) => {
    const res = await axiosJWT
      .get(API_ENDPOINTS.ADMIN.STATS.TRANSACTION, { params })
      .catch(() => []);
    return res?.data || [];
  },
};
