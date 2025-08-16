import API_ENDPOINTS from '@utils/api';
import { toast } from 'react-fox-toast';

export const contactAPI = {
  getAll: async (axiosJWT, params) => {
    return axiosJWT
      .get(API_ENDPOINTS.ADMIN.CONTACT.GET_ALL, { params })
      .then((res) => res.data)
      .catch(() => []);
  },

  delete: async (axiosJWT, id) => {
    try {
      const response = await axiosJWT.delete(API_ENDPOINTS.ADMIN.CONTACT.DELETE(id));
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
