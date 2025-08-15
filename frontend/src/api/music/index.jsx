import API_ENDPOINTS from '@utils/api';
import axiosClient from '@utils/axiosClient';

export const musicAPI = {
  getAll: async () => {
    return axiosClient
      .get(API_ENDPOINTS.MUSIC.GET_ALL)
      .then((res) => res.data)
      .catch(() => []);
  },
};
