import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../node_modules/react-i18next';

import { MapPinIcon } from '@heroicons/react/24/solid';

import CONSTANTS from '@constants';
import ROUTES from '@constants/routes';
import useWebConfig from '@hooks/useWebConfig';
import { renderWebConfigsToDOM } from '@helpers/renderWebConfigsToDOM';

export default function Footer() {
  const { t, i18n } = useTranslation('footer');

  const [webData, setWebData] = useState({
    contacts: null,
    socials: null,
  });

  const { webConfigs, loading: configLoading } = useWebConfig();

  useEffect(() => {
    if (!configLoading && webConfigs.length > 0) {
      renderWebConfigsToDOM(webConfigs, i18n.language);
    }
  }, [configLoading, webConfigs, i18n.language]);

  useEffect(() => {
    if (configLoading || !webConfigs.length) return;

    const getValue = key => webConfigs.find(item => item.key === key)?.value;

    setWebData({
      contacts: getValue('contacts'),
      socials: getValue('socials'),
    });
  }, [webConfigs, configLoading]);

  return (
    <div className="mx-auto mt-10 border-t px-4 pt-10 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
      <div className="row-gap-6 mb-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link to={ROUTES.HOME} aria-label="Go home" className="inline-flex items-center">
            <span className="text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              {CONSTANTS.SITE_NAME}
            </span>
          </Link>
          <div className="mt-6 lg:max-w-sm">
            <p className="text-sm text-gray-800 dark:text-gray-100" data-key="description_site"></p>
          </div>
        </div>
        <div className="space-y-2 text-sm" data-key="contacts">
          <p className="text-base font-bold tracking-wide text-gray-900 dark:text-white">
            {t('contacts')}
          </p>
          <div className="flex">
            <p className="mr-1 text-gray-800 dark:text-gray-100">{t('phone')}:</p>
            <a
              href={`tel:${webData.contacts?.phone}`}
              aria-label={t('phone')}
              title={t('phone')}
              className="text-deep-purple-accent-400 transition-colors duration-300 hover:underline"
            >
              {webData.contacts?.phone}
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-gray-800 dark:text-gray-100">{t('email')}:</p>
            <a
              href={`mailto:${webData.contacts?.email}`}
              aria-label={t('email')}
              title={t('email')}
              className="text-deep-purple-accent-400 transition-colors duration-300 hover:underline"
            >
              {webData.contacts?.email}
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-gray-800 dark:text-gray-100">{t('address')}:</p>
            <Link
              to={webData.contacts?.google_map}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('address')}
              title={t('address')}
              className="text-deep-purple-accent-400 flex items-center transition-colors duration-300 hover:underline"
            >
              <MapPinIcon className="size-4" />
              Google map
            </Link>
          </div>
        </div>
        <div>
          {/* social */}
          <span className="text-base font-bold tracking-wide text-gray-900 dark:text-white">
            {t('social')}
          </span>
          <div className="mt-1 flex items-center space-x-3">
            <Link
              to={webData.socials?.instagram}
              target="_blank"
              className="text-gray-500 transition-colors duration-300 dark:text-gray-200"
            >
              <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                <circle cx="15" cy="15" r="4"></circle>
                <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"></path>
              </svg>
            </Link>
            <Link
              to={webData.socials?.facebook}
              target="_blank"
              className="text-gray-500 transition-colors duration-300 dark:text-gray-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"></path>
              </svg>
            </Link>
          </div>
          {/* end social */}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-200" data-key="contacts_note"></p>
        </div>
      </div>
      <div className="flex flex-col-reverse justify-between border-t pb-10 pt-5 lg:flex-row">
        <p className="text-sm text-gray-600 dark:text-gray-200" data-key="copyright"></p>
        <ul className="mb-3 flex flex-col space-y-2 sm:flex-row sm:space-x-5 sm:space-y-0 lg:mb-0">
          <li>
            <Link
              to="/"
              className="text-sm text-gray-600 transition-colors duration-300 hover:underline dark:text-gray-200"
            >
              {t('faq')}
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="text-sm text-gray-600 transition-colors duration-300 hover:underline dark:text-gray-200"
            >
              {t('privacy_policy')}
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="text-sm text-gray-600 transition-colors duration-300 hover:underline dark:text-gray-200"
            >
              {t('terms_and_conditions')}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
