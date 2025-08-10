import { useEffect, useState } from 'react';

import { useSocketContext } from '@contexts/socket/useSocketContext';
import { setCachedData } from '@helpers/cacheSession';

/**
 * @param {Object} options
 * @param {string} options.cacheKey
 * @param {number} [options.ttl=600000]
 * @param {Function} options.fetcher
 */
const useCachedApi = ({ cacheKey, ttl = 10 * 60 * 1000, fetcher }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useSocketContext();

  useEffect(() => {
    const raw = sessionStorage.getItem(cacheKey);

    if (!raw) {
      fetchAndCache();
      return;
    }

    try {
      const { data: cachedData, timestamp } = JSON.parse(raw);
      const isExpired = Date.now() - timestamp > ttl;

      if (!isExpired) {
        setData(cachedData);
        setLoading(false);
      } else if (!isConnected) {
        setData(cachedData);
        setLoading(false);
      } else {
        fetchAndCache();
      }
    } catch {
      fetchAndCache();
    }

    async function fetchAndCache() {
      try {
        setLoading(true);
        const result = await fetcher();
        setData(result);
        setCachedData(cacheKey, result);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
  }, [cacheKey, ttl, fetcher, isConnected]);

  return { data, loading };
};

export default useCachedApi;
