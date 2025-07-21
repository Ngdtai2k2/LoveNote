import { toast } from 'react-fox-toast';
import API_ENDPOINTS from '@utils/api';

export const paymentAPI = {
  createPaymentLink: async (axiosJWT, payload) => {
    try {
      return await axiosJWT.post(API_ENDPOINTS.PAYMENT.CREATE_LINK, payload);
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: 'top-right',
      });
    }
  },

  cancelPayment: async (axiosJWT, orderCode) => {
    try {
      return await axiosJWT.post(API_ENDPOINTS.PAYMENT.CANCEL_LINK, { orderCode });
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },
};
