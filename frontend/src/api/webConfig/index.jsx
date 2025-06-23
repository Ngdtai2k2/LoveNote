import axios from 'axios';

import API_ENDPOINTS from '@utils/api';

export const webConfigAPI = {
  getAll: async () => {
    const data = await axios.get(`${API_ENDPOINTS.WEB_CONFIG.GET_ALL}?raw=true`);
    return data;
  },
};
