import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function SiteStatusPage({ type = 'not_active' }) {
  const { t } = useTranslation('product');

  useDocumentTitle(t(type === 'expired' ? 'web_expired' : 'web_not_active'));

  const statusMap = {
    not_active: {
      icon: <ExclamationTriangleIcon className="h-24 w-24 text-yellow-500" />,
      title: t('web_not_active'),
      message: t('web_not_active_note'),
    },
    expired: {
      icon: <XCircleIcon className="h-24 w-24 text-red-500" />,
      title: t('web_expired'),
      message: t('web_expired_note'),
    },
  };

  const { icon, title, message } = statusMap[type] || statusMap.not_active;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
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
