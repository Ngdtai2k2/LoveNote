import API_ENDPOINTS from '@utils/api';
import axiosClient from '@utils/axiosClient';

export const webConfigAPI = {
  getAll: async () => {
    const data = await axiosClient.get(`${API_ENDPOINTS.WEB_CONFIG.GET_ALL}?raw=true`);
    return data;
  },
};
