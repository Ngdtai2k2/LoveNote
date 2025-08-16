import API_ENDPOINTS from '@utils/api';
import { toast } from 'react-fox-toast';

export const bannerAPI = {
  getAll: async (axiosJWT, params) => {
    return axiosJWT
      .get(API_ENDPOINTS.ADMIN.BANNER.GET_ALL, { params })
      .then((res) => res.data)
      .catch(() => []);
  },

  activated: async (axiosJWT, id) => {
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.ADMIN.BANNER.ACTIVATED(id));

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
