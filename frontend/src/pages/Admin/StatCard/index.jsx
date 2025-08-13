import React from 'react';

import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

export default function StatCard({ title, value, icon, change, loading }) {
  const { t } = useTranslation('admin');

  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col gap-2 justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col gap-2 justify-between hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-gray-500 dark:text-gray-200 text-sm">{title}</h4>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-300">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>

      {change && (
        <div
          className={`text-sm font-medium flex items-center gap-1 ${
            isPositive
              ? 'text-green-600 dark:text-green-400'
              : isNegative
                ? 'text-red-600 dark:text-red-500'
                : ''
          }`}
        >
          {isPositive && <ArrowTrendingUpIcon className="h-4 w-4" />}
          {isNegative && <ArrowTrendingDownIcon className="h-4 w-4" />}
          {(isPositive || isNegative) && t('dashboard.compared', { value: change })}
        </div>
      )}
    </div>
  );
}
