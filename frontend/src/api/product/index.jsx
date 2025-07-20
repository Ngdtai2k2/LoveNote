import API_ENDPOINTS from '@utils/api';
import fetchPaginatedData from '@helpers/fetchPaginatedData';
import axiosClient from '@utils/axiosClient';
import { toast } from 'react-fox-toast';

export const productAPI = {
  getAll: async (page, limit) => {
    const { data, error } = await fetchPaginatedData(API_ENDPOINTS.PRODUCT.GET_ALL, {
      params: { page: page, limit: limit },
    });

    if (error) return null;

    return data;
  },

  getProductBySlug: async (slug) => {
    try {
      const data = await axiosClient.get(API_ENDPOINTS.PRODUCT.GET_BY_SLUG(slug));

      return data;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
      return null;
    }
  },
};
