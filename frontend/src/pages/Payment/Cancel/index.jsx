import React from 'react';
import { Link } from 'react-router-dom';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

export default function Cancel() {
  const { t } = useTranslation('payment');

  return (
    <div className="my-10 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md text-center max-w-md">
        <XCircleIcon className="w-32 h-32 text-red-500 dark:text-red-400 mx-auto" />
        <h1 className="text-2xl font-bold mt-4 text-red-700 dark:text-red-400">{t('cancel')}!</h1>
        <p className="text-gray-600 dark:text-gray-200 mt-2">{t('cancel_note')}</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
