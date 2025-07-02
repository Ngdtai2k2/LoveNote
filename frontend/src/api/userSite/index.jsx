import { toast } from 'react-fox-toast';

import API_ENDPOINTS from '@utils/api';
import axiosClient from '@utils/axiosClient';

export const userSiteAPI = {
  getSiteConfig: async ({ id, slug }) => {
    try {
      const params = {};

      if (slug) {
        params.slug = slug;
      } else if (id) {
        params.id = id;
      }

      const res = await axiosClient.get(API_ENDPOINTS.USER_SITES.GET_CONFIGS, {
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
      const res = await axiosClient.get(API_ENDPOINTS.USER_SITES.CHECK_SLUG, {
        params: { slug },
      });
      return res.data === true;
    } catch {
      return false;
    }
  },

  getSitesByUser: async (axiosJWT, page, limit) => {
    try {
      const res = await axiosJWT.get(API_ENDPOINTS.USER_SITES.GET_BY_USER, {
        params: {
          page: page || 1,
          limit: limit || 4,
        },
      });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
      return [];
    }
  },

  deleteConfigSite: async (axiosJWT, id) => {
    try {
      const res = await axiosJWT.delete(API_ENDPOINTS.USER_SITES.DELETE_CONFIGS(id));
      toast.success(res.data.message, {
        position: 'top-right',
      });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
      return null;
    }
  },
};
