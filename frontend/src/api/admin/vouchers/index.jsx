import API_ENDPOINTS from '@utils/api';
import { toast } from 'react-fox-toast';

export const vouchersAPI = {
  getVoucherTemplate: async (axiosJWT, params) => {
    return axiosJWT
      .get(API_ENDPOINTS.ADMIN.VOUCHERS.GET_TEMPLATE, { params })
      .then((res) => res.data)
      .catch(() => []);
  },

  createTemplate: async (axiosJWT, data) => {
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.ADMIN.VOUCHERS.CREATE_TEMPLATE, data);
      toast.success(response.data.message, {
        position: 'top-right',
      });
      return response;
    } catch (error) {
      return toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  assignVoucher: async (axiosJWT, data) => {
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.ADMIN.VOUCHERS.ASSIGN, data);
      toast.success(response.data.message, {
        position: 'top-right',
      });
      return response;
    } catch (error) {
      return toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },
};
