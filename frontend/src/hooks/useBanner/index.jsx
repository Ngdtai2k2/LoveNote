import { useCallback, useEffect, useRef, useState } from 'react';

import { bannerAPI } from '@api/public/banner';

const useBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const retryTimeoutRef = useRef(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bannerAPI.getAll(true);
      if (res && Array.isArray(res.data)) {
        setBanners(res.data);
        if (res.data.length === 0) {
          retryTimeoutRef.current = setTimeout(
            () => {
              fetchBanners();
            },
            5000 + Math.random() * 5000
          );
        } else {
          setLoading(false);
        }
        return;
      }
      throw new Error('Invalid data');
    } catch {
      retryTimeoutRef.current = setTimeout(
        () => {
          fetchBanners();
        },
        5000 + Math.random() * 5000
      );
    }
  }, []);

  useEffect(() => {
    fetchBanners();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchBanners]);

  return {
    banners,
    loading,
  };
};

export default useBanner;
