import axios from "axios";

import API_ENDPOINTS from "@utils/api";

export const bannerAPI = {
  getAll: async (isActive) => {
    const data = await axios.get(
      `${API_ENDPOINTS.BANNER.GET_ALL}?is_active=${isActive}`,
    );
    return data;
  },
};
