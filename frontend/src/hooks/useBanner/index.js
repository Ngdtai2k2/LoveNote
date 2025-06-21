import { useEffect, useState } from 'react';

import { getCachedBanners, setCachedBanners } from '@helpers/bannerCache';
import { bannerAPI } from '@api/banner';

const useBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cache = getCachedBanners();
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
        setCachedBanners(res.data);
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
