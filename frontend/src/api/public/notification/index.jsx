import API_ENDPOINTS from '@utils/api';
import { toast } from 'react-fox-toast';

export const notificationAPI = {
  getByUser: async (axiosJWT, params) => {
    return axiosJWT
      .get(API_ENDPOINTS.NOTIFICATION.GET_BY_USER, { params })
      .then((res) => res.data)
      .catch(() => []);
  },

  markRead: async (axiosJWT, id) => {
    try {
      return await axiosJWT.put(API_ENDPOINTS.NOTIFICATION.MARK_READ(id));
    } catch (error) {
      return toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  markReadAll: async (axiosJWT) => {
    try {
      return await axiosJWT.put(API_ENDPOINTS.NOTIFICATION.MARK_READ_ALL);
    } catch (error) {
      return toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },
};
