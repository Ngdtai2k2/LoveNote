import { useCallback, useEffect, useRef, useState } from 'react';

import { webConfigAPI } from '@api/webConfig';

const useWebConfig = () => {
  const [webConfigs, setWebConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const retryTimeoutRef = useRef(null);
  const calledRef = useRef(false);

  const fetchWebConfigs = useCallback(async () => {
    if (calledRef.current) return;
    calledRef.current = true;

    setLoading(true);

    try {
      const res = await webConfigAPI.getAll(true);
      if (res && Array.isArray(res.data)) {
        setWebConfigs(res.data);
        setLoading(false);

        sessionStorage.setItem('webConfigs', JSON.stringify(res.data));

        if (res.data.length === 0) {
          retryTimeoutRef.current = setTimeout(
            () => {
              calledRef.current = false;
              fetchWebConfigs();
            },
            60000 + Math.random() * 30000
          );
        }
      } else {
        throw new Error('Invalid data');
      }
    } catch {
      retryTimeoutRef.current = setTimeout(
        () => {
          calledRef.current = false;
          fetchWebConfigs();
        },
        60000 + Math.random() * 30000
      );
    }
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem('webConfigs');
    if (cached) {
      setWebConfigs(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchWebConfigs();
    }

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
