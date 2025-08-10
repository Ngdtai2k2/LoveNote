import React from 'react';

import ROUTES from '@constants/routes';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useDocumentTitle } from '@hooks/useDocumentTitle';

import LayoutAdmin from '@components/Layout/Admin';
import LayoutUser from '@components/Layout/User';

export default function NotFound({ isAdmin = false }) {
  const { t } = useTranslation('notfound');

  useDocumentTitle(t('page_not_found'));

  const content = (
    <div className="mt-10 flex flex-col items-center justify-center pt-10 dark:bg-gray-800">
      <h1 className="mb-4 text-8xl font-bold text-gray-900 dark:text-gray-200">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        {t('page_not_found')}
      </h2>
      <p className="mb-6 text-center text-gray-700 dark:text-gray-200">
        {t('page_not_found_title')}
      </p>
      <Link
        to={isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME}
        className="rounded bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-900"
      >
        {t('go_home')}
      </Link>
    </div>
  );

  return isAdmin ? <LayoutAdmin>{content}</LayoutAdmin> : <LayoutUser>{content}</LayoutUser>;
}

NotFound.propTypes = {
  isAdmin: PropTypes.bool,
};
