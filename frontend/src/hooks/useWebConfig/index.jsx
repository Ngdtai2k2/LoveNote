import { useCallback } from 'react';
import { webConfigAPI } from '@api/webConfig';
import useCachedApi from '@hooks/useCachedApi';

const useWebConfig = () => {
  const fetcher = useCallback(() => {
    return webConfigAPI
      .getAll(true)
      .then((res) => {
        if (res && res.data) return res.data;
      })
      .catch(() => {
        return [];
      });
  }, []);

  const { data: webConfigs, loading } = useCachedApi({
    cacheKey: 'web_configs',
    ttl: 10 * 60 * 1000,
    fetcher,
  });

  return {
    webConfigs: Array.isArray(webConfigs) ? webConfigs : [],
    loading,
  };
};

export default useWebConfig;
