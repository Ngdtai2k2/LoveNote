import { useEffect, useState } from 'react';
import { getCachedData, setCachedData } from '@helpers/cacheSession';

/**
 * @param {Object} options
 * @param {string} options.cacheKey
 * @param {number} [options.ttl=600000]
 * @param {Function} options.fetcher - fetch func
 */

const useCachedApi = ({ cacheKey, ttl = 10 * 60 * 1000, fetcher }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cache = getCachedData(cacheKey, ttl);
    if (cache) {
      setData(cache);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetcher();
        setData(result);
        setCachedData(cacheKey, result);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cacheKey, ttl, fetcher]);

  return { data, loading };
};

export default useCachedApi;
