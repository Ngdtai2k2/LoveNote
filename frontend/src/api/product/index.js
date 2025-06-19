import API_ENDPOINTS from '@constants/api';
import fetchPaginatedData from '@helpers/fetchPaginatedData';

export const getAll = async (page, limit) => {
  const { data, error } = await fetchPaginatedData(API_ENDPOINTS.PRODUCT.GET_ALL, {
    params: { page: page, limit: limit },
  });

  if (error) return null;

  return data;
};
