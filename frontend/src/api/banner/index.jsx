import API_ENDPOINTS from '@utils/api';
import axiosClient from '@utils/axiosClient';

export const bannerAPI = {
  getAll: async (isActive) => {
    const data = await axiosClient.get(`${API_ENDPOINTS.BANNER.GET_ALL}?is_active=${isActive}`);
    return data;
  },
};
