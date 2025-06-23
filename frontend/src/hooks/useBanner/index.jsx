import { useCallback } from 'react';
import { bannerAPI } from '@api/banner';
import useCachedApi from '@hooks/useCachedApi';

const useBanner = () => {
  const fetchBanners = useCallback(() => {
    return bannerAPI.getAll(true).then((res) => res.data);
  }, []);

  const { data: banners, loading } = useCachedApi({
    cacheKey: 'banners',
    ttl: 5 * 60 * 1000,
    fetcher: fetchBanners,
  });

  return { banners: banners || [], loading };
};

export default useBanner;
