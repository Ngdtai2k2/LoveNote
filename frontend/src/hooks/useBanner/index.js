import { useEffect, useState } from 'react';

import { bannerAPI } from '@api/banner';
import { getCachedData, setCachedData } from '@helpers/cacheSession';

const useBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cache = getCachedData('banners', 5 * 60 * 1000);
    if (cache) {
      setBanners(cache);
      setLoading(false);
      return;
    }

    const getBanners = async () => {
      try {
        setLoading(true);
        const res = await bannerAPI.getAll(true);
        setBanners(res.data);
        setCachedData('banners', res.data);
      } catch (error) {
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    getBanners();
  }, []);

  return { banners, loading };
};

export default useBanner;
