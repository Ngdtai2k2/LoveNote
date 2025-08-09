import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAxios } from '@hooks/useAxiosJWT';
import { logsApi } from '@api/admin/logs';

export default function LogViewer() {
  const [logData, setLogData] = useState('');
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  const preRef = useRef(null);

  useEffect(() => {
    async function fetchLog() {
      try {
        setLoading(true);
        const data = await logsApi.getLogsAutoDeleteSites(axiosJWT);
        setLogData(data);
      } finally {
        setLoading(false);
      }
    }

    fetchLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [logData, loading]);

  return (
    <div className="p-4 md:mx-5">
      <h1 className="text-base mb-4 font-semibold text-gray-900 dark:text-gray-100">
        {t('logs.auto_delete_sites')}
      </h1>

      {loading && (
        <div
          className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto dark:border-gray-600 dark:border-t-gray-300"
          aria-label="Loading spinner"
        />
      )}

      {!loading && (
        <pre
          ref={preRef}
          className="p-4 font-mono rounded overflow-auto max-h-[70vh] whitespace-pre-wrap break-words bg-gray-100 
          text-gray-900 dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700 scrollbar-thin 
           scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {logData || t('logs.no_logs')}
        </pre>
      )}
    </div>
  );
}
