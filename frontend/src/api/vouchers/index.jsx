import API_ENDPOINTS from '@utils/api';
import axiosClient from '@utils/axiosClient';
import { toast } from 'react-fox-toast';

export const vouchersAPI = {
  getVoucherTemplate: async (type) => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.VOUCHERS.GET_TEMPLATE(type));

      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  redeem: async (axiosJWT, templateId) => {
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.VOUCHERS.REDEEM, { templateId });

      toast.success(response?.data.message, {
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  getVoucherRedeemByUser: async (axiosJWT, isUsed) => {
    try {
      const response = await axiosJWT.get(
        API_ENDPOINTS.VOUCHERS.GET_VOUCHER_REDEEM_BY_USER(isUsed)
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  checkVoucher: async (axiosJWT, voucherCode, slug) => {
    try {
      const response = await axiosJWT.post(
        API_ENDPOINTS.VOUCHERS.CHECK(voucherCode),
        {},
        {
          params: {
            slug: slug,
          },
        }
      );
      return {
        code: response.status,
        data: response.data,
        message: null,
      };
    } catch (error) {
      return {
        code: error.response?.status,
        data: null,
        message: error.response?.data.message,
      };
    }
  },
};
