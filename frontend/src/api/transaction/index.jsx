import API_ENDPOINTS from '@utils/api';
import { toast } from 'react-fox-toast';

export const transactionAPI = {
  getByUser: async (axiosJWT, page, limit) => {
    try {
      const res = await axiosJWT.get(API_ENDPOINTS.TRANSACTION.GET_BY_USER, {
        params: {
          page: page || 1,
          limit: limit || 4,
        },
      });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
      return [];
    }
  },
};
