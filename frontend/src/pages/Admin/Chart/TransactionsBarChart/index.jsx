import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import 'chart.js/auto';

import { statsAPI } from '@api/admin/stats';
import { useAxios } from '@hooks/useAxiosJWT';

export default function TransactionsBarChart() {
  const today = dayjs().format('YYYY-MM-DD');
  const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

  const [stats, setStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  const getTransactionsData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.start = startDate;
      if (endDate) params.end = endDate;

      const res = await statsAPI.transaction(axiosJWT, params);
      setStats(res.stats || []);
      setTotalRevenue(res.totalRevenue || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactionsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = {
    labels: stats.map((s) => s.status),
    datasets: [
      {
        label: t('chart.transactions_bar.total'),
        data: stats.map((s) => Number(s.count)),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: '#2196f3',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: t('dashboard.stats.revenue'),
        data: stats.map((s) => Number(s.total_amount)),
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: '#4caf50',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        title: { display: true, text: t('chart.transactions_bar.total') },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: t('dashboard.stats.revenue') },
      },
    },
  };

  return (
    <div className="p-2 mx-auto">
      <h2 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('chart.transactions_bar.title')}
      </h2>

      <div className="flex flex-col lg:flex-row gap-1 mb-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 
                     focus:ring-blue-500"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 
                     focus:ring-blue-500"
        />
        <button
          onClick={getTransactionsData}
          disabled={loading}
          className="rounded-lg px-4 py-2 font-medium text-white bg-blue-500 hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto" />
          ) : (
            t('chart.filter')
          )}
        </button>
      </div>

      {!loading && stats.length > 0 && (
        <>
          <div className="w-full h-96 mt-4">
            <Bar data={chartData} options={options} />
          </div>
          <p className="mt-4 text-center font-semibold text-gray-900 dark:text-gray-100">
            {t('chart.transactions_bar.total_revenue', {
              total: totalRevenue.toLocaleString('vi-VN'),
            })}
          </p>
        </>
      )}

      {!loading && stats.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Không có dữ liệu</p>
      )}
    </div>
  );
}
