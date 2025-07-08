import API_ENDPOINTS from '@utils/api';
import fetchPaginatedData from '@helpers/fetchPaginatedData';

export const productAPI = {
  getAll: async (page, limit) => {
    const { data, error } = await fetchPaginatedData(API_ENDPOINTS.PRODUCT.GET_ALL, {
      params: { page: page, limit: limit },
    });

    if (error) return null;

    return data;
  },
};
