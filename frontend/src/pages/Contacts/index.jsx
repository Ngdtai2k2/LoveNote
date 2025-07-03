import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';

import { useDocumentTitle } from '@hooks/useDocumentTitle';
import useWebConfig from '@hooks/useWebConfig';

export default function Contacts() {
  const [webData, setWebData] = useState({
    contacts: null,
    socials: null,
  });

  const { t, i18n } = useTranslation('footer');

  useDocumentTitle(t('contacts'));

  const { webConfigs, loading: configLoading } = useWebConfig();
  const contactsNote = webConfigs.find((item) => item.key === 'contacts_note');

  useEffect(() => {
    if (configLoading || !webConfigs.length) return;

    const getValue = (key) => webConfigs.find((item) => item.key === key)?.value;

    setWebData({
      contacts: getValue('contacts'),
      socials: getValue('socials'),
    });
  }, [webConfigs, configLoading]);

  return (
    <div className="pt-12 pb-16">
      {configLoading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
              {t('contacts')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              {contactsNote?.value[i18n.language]}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                    <PhoneIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">
                    {t('phone')}
                  </p>
                  <a
                    href={`tel:${webData.contacts?.phone}`}
                    aria-label={t('phone')}
                    title={t('phone')}
                    className="mt-1 text-base text-gray-500 dark:text-gray-300 hover:underline"
                  >
                    {webData.contacts?.phone}
                  </a>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                    <EnvelopeIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">
                    {t('email')}
                  </p>
                  <a
                    href={`mailto:${webData.contacts?.email}`}
                    aria-label={t('email')}
                    title={t('email')}
                    className="mt-1 text-base text-gray-500 dark:text-gray-300 hover:underline"
                  >
                    {webData.contacts?.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                    <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                      <circle cx="15" cy="15" r="4"></circle>
                      <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <Link to={webData.socials?.instagram} target="_blank">
                    <p className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200 hover:underline">
                      Instagram
                    </p>
                  </Link>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                      <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <Link
                    to={webData.socials?.facebook}
                    target="_blank"
                    className="text-gray-500 transition-colors duration-300 dark:text-gray-200"
                  >
                    <p className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200 hover:underline">
                      Facebook
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
