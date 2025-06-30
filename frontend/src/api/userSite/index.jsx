import axios from 'axios';
import { toast } from 'react-fox-toast';

import API_ENDPOINTS from '@utils/api';

export const userSiteAPI = {
  getSiteConfig: async ({ id, slug }) => {
    try {
      const params = {};

      if (slug) {
        params.slug = slug;
      } else if (id) {
        params.id = id;
      }

      const res = await axios.get(API_ENDPOINTS.USER_SITES.GET_CONFIGS, {
        params,
      });

      return res.data;
    } catch {
      return null;
    }
  },

  createSiteConfig: async (axiosJWT, data) => {
    try {
      const res = await axiosJWT.post(API_ENDPOINTS.USER_SITES.CREATE, data);
      // toast.success(res.data.message, {
      //   position: 'top-right',
      // });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  checkSlugExists: async (slug) => {
    try {
      const res = await axios.get(API_ENDPOINTS.USER_SITES.CHECK_SLUG, {
        params: { slug },
      });
      return res.data === true;
    } catch {
      return false;
    }
  },
};
