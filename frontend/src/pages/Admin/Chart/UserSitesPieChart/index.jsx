import React, { useEffect, useState } from 'react';

import helperFunctions from '@helpers';
import 'chart.js/auto';
import dayjs from 'dayjs';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { statsAPI } from '@api/admin/stats';

import { useAxios } from '@hooks/useAxiosJWT';

export default function UserSitesPieChart() {
  const today = dayjs().format('YYYY-MM-DD');
  const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  const getUserSitesData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.start = startDate;
      if (endDate) params.end = endDate;

      const data = await statsAPI.userSites(axiosJWT, params);
      setStats(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserSitesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = {
    labels: stats.map((s) => s.product?.name || 'N/A'),
    datasets: [
      {
        label: t('chart.total'),
        data: stats.map((s) => Number(s.count) || 0),
        backgroundColor: helperFunctions.getDistinctColors(stats.length),
      },
    ],
    borderWidth: 1,
  };

  return (
    <div className="p-2 mx-auto">
      <h2 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('chart.user_site_pie.title')}
      </h2>

      <div className="flex flex-col lg:flex-row gap-1 mb-2">
        <input
          type="date"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
               text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 
               focus:ring-blue-500"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
               text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 
               focus:ring-blue-500"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={getUserSitesData}
          disabled={loading}
          className="rounded-lg px-4 py-2 font-medium text-white bg-blue-500 hover:bg-blue-600 
               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto" />
          ) : (
            t('chart.filter')
          )}
        </button>
      </div>

      {!loading && stats.length > 0 && (
        <div className="w-full h-96 mt-4">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      )}

      {!loading && stats.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">{t('chart.no_data')}</p>
      )}
    </div>
  );
}
