import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ROUTES from '@constants/routes';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function NotFound({ isAdmin = false }) {
  const { t } = useTranslation('notfound');

  useDocumentTitle(t('page_not_found'));

  return (
    <div className="flex flex-col items-center justify-center mt-10 pt-10 dark:bg-gray-800">
      <h1 className="text-8xl font-bold text-gray-900 dark:text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {t('page_not_found')}
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-200 mb-6">
        {t('page_not_found_title')}
      </p>
      <Link
        to={isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME}
        className="px-6 py-2 bg-gray-600 hover:bg-gray-800 dark:bg-gray-600 text-white rounded dark:hover:bg-gray-900 transition"
      >
        {t('go_home')}
      </Link>
    </div>
  );
}

NotFound.propTypes = {
  isAdmin: PropTypes.bool,
};
