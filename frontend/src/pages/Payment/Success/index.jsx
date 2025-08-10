import React from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Success() {
  const { t } = useTranslation('payment');

  return (
    <div className="my-10 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md text-center max-w-md">
        <CheckCircleIcon className="w-32 h-32 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-4 text-green-700 dark:text-green-400">
          {t('success')}!
        </h1>
        <p className="text-gray-600 dark:text-gray-200 mt-2">{t('thanks')}</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
