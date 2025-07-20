import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function NotActivePage() {
  const { t } = useTranslation('product');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-700 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <ExclamationTriangleIcon className="h-24 w-24 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('web_not_active')}</h1>
        <p className="text-gray-600 dark:text-gray-200 mb-6">{t('web_not_active_note')}</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
