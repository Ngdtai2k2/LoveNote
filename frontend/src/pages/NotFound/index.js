import React from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from '@constants/routes';

export default function NotFound() {
  const { t } = useTranslation('notfound');
  return (
    <div className="flex flex-col items-center justify-center mt-10 pt-10 dark:bg-gray-800">
      <h1 className="text-8xl font-bold text-pink-300 dark:text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-pink-400 dark:text-gray-200 mb-2">
        {t('page_not_found')}
      </h2>
      <p className="text-center text-pink-600 dark:text-gray-200 mb-6">
        {t('page_not_found_title')}
      </p>
      <a
        href={ROUTES.HOME}
        className="px-6 py-2 bg-pink-300 hover:bg-pink-500 dark:bg-gray-600 text-white rounded dark:hover:bg-gray-900 transition"
      >
        {t('go_home')}
      </a>
    </div>
  );
}
