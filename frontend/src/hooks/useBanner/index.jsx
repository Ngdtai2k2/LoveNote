import { useCallback } from 'react';
import { bannerAPI } from '@api/banner';
import useCachedApi from '@hooks/useCachedApi';

const useBanner = () => {
  const fetchBanners = useCallback(() => {
    return bannerAPI
      .getAll(true)
      .then((res) => {
        if (res && res.data) return res.data;
      })
      .catch(() => {
        return [];
      });
  }, []);

  const { data: banners, loading } = useCachedApi({
    cacheKey: 'banners',
    ttl: 5 * 60 * 1000,
    fetcher: fetchBanners,
  });

  return {
    banners: Array.isArray(banners) ? banners : [],
    loading,
  };
};

export default useBanner;
