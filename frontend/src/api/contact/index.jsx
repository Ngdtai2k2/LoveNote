import { toast } from 'react-fox-toast';

import axiosClient from '@utils/axiosClient';
import API_ENDPOINTS from '@utils/api';

export const contactAPI = {
  create: async (data) => {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.CONTACT.CREATE, data);
      toast.success(res.data.message, {
        position: 'top-right',
      });
      return res;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },
};
