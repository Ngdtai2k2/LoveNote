import { toast } from 'react-fox-toast';

import API_ENDPOINTS from '@utils/api';

export const taskAPI = {
  createShortLinks: async (axiosJWT, providerId) => {
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.TASK.CREATE, {
        providerId: providerId,
      });

      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
      return null;
    }
  },

  verifyTokenShortLink: async (axiosJWT, token) => {
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.TASK.VERIFY_TOKEN(token));

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

  checkVerifyTokenExp: async (axiosJWT, token) => {
    try {
      const response = await axiosJWT.get(API_ENDPOINTS.TASK.CHECK_TOKEN(token));

      return response.data;
    } catch {
      return false;
    }
  },
};
