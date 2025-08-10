import API_ENDPOINTS from '@utils/api';
import { toast } from 'react-fox-toast';

export const usersAPI = {
  allUsers: (axiosJWT, params) => {
    return axiosJWT
      .get(API_ENDPOINTS.ADMIN.USERS.ALL_USERS, { params })
      .then((res) => res.data)
      .catch(() => []);
  },

  banned: async (axiosJWT, id) => {
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.ADMIN.USERS.BANNED(id));

      toast.success(response.data.message, {
        position: 'top-right',
      });

      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },
};
