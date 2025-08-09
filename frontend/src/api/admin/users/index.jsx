import API_ENDPOINTS from '@utils/api';

export const usersAPI = {
  allUsers: (axiosJWT, params) => {
    return axiosJWT
      .get(API_ENDPOINTS.ADMIN.USERS.ALL_USERS, { params })
      .then((res) => res.data)
      .catch(() => []);
  },
};
