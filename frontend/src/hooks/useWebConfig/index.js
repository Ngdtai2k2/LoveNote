import { useCallback } from 'react';
import { webConfigAPI } from '@api/webConfig';
import useCachedApi from '@hooks/useCachedApi';

const useWebConfig = () => {
  const fetcher = useCallback(() => {
    return webConfigAPI.getAll(true).then(res => res.data);
  }, []);

  const { data: webConfigs, loading } = useCachedApi({
    cacheKey: 'web_configs',
    ttl: 10 * 60 * 1000,
    fetcher,
  });

  return { webConfigs: webConfigs || [], loading };
};

export default useWebConfig;
