import API_ENDPOINTS from '@utils/api';

export const shortenerProviderAPI = {
  getShortenerProviderByUser: async (axiosJWT) => {
    const response = await axiosJWT.get(API_ENDPOINTS.SHORTENER_PROVIDER.GET_BY_USER);
    return response.data;
  },
};
