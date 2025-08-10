import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useDocumentTitle } from '@hooks/useDocumentTitle';
import useWebConfig from '@hooks/useWebConfig';

import ArcMenu from '@components/ArcMenu';

export default function About() {
  const [webData, setWebData] = useState({});

  const { t, i18n } = useTranslation('about');
  const { webConfigs, loading: configLoading } = useWebConfig();

  const lng = i18n.language;
  const camelCase = (str) => str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

  useDocumentTitle(t('about_website'));

  useEffect(() => {
    if (configLoading || !webConfigs.length) return;

    const keys = [
      'about_me',
      'avatar_me',
      'purpose_website',
      'technology_used',
      'thanks',
      'description_site',
    ];

    const mappedData = Object.fromEntries(
      keys.map((key) => [camelCase(key), webConfigs.find((item) => item.key === key)?.value])
    );

    setWebData(mappedData);
  }, [webConfigs, configLoading]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      {configLoading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      ) : (
        <>
          <section className="mb-10 text-gray-900 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-3 text-center">{t('about_website')}</h1>
            <p className="text-lg">{webData?.descriptionSite?.[lng]}</p>
          </section>

          <section className="mb-10 text-center">
            <img
              src={webData?.avatarMe?.url}
              alt="Avatar"
              className="w-60 h-60 p-1 rounded-full mx-auto shadow-lg border-4 dark:border-white border-gray-900 object-cover"
            />
          </section>

          <section className="mb-10 text-gray-900 dark:text-gray-200">
            <h2 className="text-3xl font-semibold mb-2">{t('about_me')}</h2>
            <p className="text-lg">{webData?.aboutMe?.[lng]}</p>
          </section>

          <section className="mb-10 text-gray-900 dark:text-gray-200">
            <h2 className="text-3xl font-semibold mb-2">{t('purpose_website')}</h2>
            <p className="text-lg mb-2">{webData?.purposeWebsite?.[lng]}</p>
          </section>

          <section className="mb-10 text-gray-900 dark:text-gray-200">
            <h2 className="text-3xl font-semibold mb-2">{t('technology_used')}</h2>
            <h3 className="ms-4 text-xl font-bold mb-1">- Front-end</h3>
            <p className="ms-6 list-disc list-inside text-lg space-y-1 whitespace-pre-line">
              {webData?.technologyUsed?.frontend}
            </p>
            <h3 className="ms-4 text-xl font-bold mb-1">- Back-end</h3>{' '}
            <p className="ms-6 list-disc list-inside text-lg space-y-1 whitespace-pre-line">
              {webData?.technologyUsed?.backend}
            </p>
          </section>

          <section className="text-center mt-16 text-gray-900 dark:text-gray-200">
            <h2 className="text-3xl font-semibold mb-4">{t('thanks_visiting')}</h2>
            <p className="text-lg">{webData?.thanks?.[lng]}</p>
          </section>
        </>
      )}
      <ArcMenu />
    </div>
  );
}
