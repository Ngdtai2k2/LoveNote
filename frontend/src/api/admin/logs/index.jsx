import API_ENDPOINTS from '@utils/api';

export const logsApi = {
  getLogsAutoDeleteSites: (axiosJWT) =>
    axiosJWT
      .get(API_ENDPOINTS.ADMIN.LOGS.AUTO_DELETE_SITES)
      .then((res) => res.data)
      .catch(() => ''),
};
