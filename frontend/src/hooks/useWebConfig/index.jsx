import { useCallback, useEffect, useState, useRef } from 'react';
import { webConfigAPI } from '@api/webConfig';

const useWebConfig = () => {
  const [webConfigs, setWebConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const retryTimeoutRef = useRef(null);

  const fetchWebConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await webConfigAPI.getAll(true);
      if (res && Array.isArray(res.data)) {
        setWebConfigs(res.data);
        if (res.data.length === 0) {
          retryTimeoutRef.current = setTimeout(
            () => {
              fetchWebConfigs();
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
          fetchWebConfigs();
        },
        5000 + Math.random() * 5000
      );
    }
  }, []);

  useEffect(() => {
    fetchWebConfigs();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchWebConfigs]);

  return {
    webConfigs,
    loading,
  };
};

export default useWebConfig;
