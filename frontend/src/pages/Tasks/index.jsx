import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Typography, Spinner } from '@material-tailwind/react';
import { ArrowTopRightOnSquareIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

import { shortenerProviderAPI } from '@api/shortenerProvider';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useAxios } from '@hooks/useAxiosJWT';
import { taskAPI } from '@api/task';

export default function Tasks() {
  const [providers, setProviders] = useState([]);
  const [loadingProviderId, setLoadingProviderId] = useState(null);

  const { t, i18n } = useTranslation(['navbar', 'tasks']);

  useDocumentTitle(t('navbar:tasks'));

  const { axiosJWT } = useAxios(i18n.language);

  const getShortenerProviderByUser = async () => {
    const res = await shortenerProviderAPI.getShortenerProviderByUser(axiosJWT);
    setProviders(res);
  };

  useEffect(() => {
    getShortenerProviderByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateShortLink = async (providerId) => {
    setLoadingProviderId(providerId);

    try {
      const res = await taskAPI.createShortLinks(axiosJWT, providerId);
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProviderId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Typography
        variant="h1"
        className="text-3xl font-bold mb-3 text-center text-gray-900 dark:text-gray-200"
      >
        {t('navbar:tasks')}
      </Typography>

      <Alert variant="outlined" className="mb-2 text-gray-900 dark:text-gray-200 border-gray-200">
        {t('tasks:note')}
      </Alert>

      <div className="mt-5">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 border-1">
          {providers?.map((provider) => (
            <li
              key={provider.id}
              className="flex flex-col md:flex-row border md:justify-between md:items-center cursor-pointer pb-2 dark:hover:bg-white/10 hover:bg-black/10 p-2 rounded"
            >
              <div className="flex items-center">
                <div className="flex flex-col justify-center">
                  <Typography variant="h6" className="py-0 my-0 flex gap-3">
                    <span className="text-[18px] font-bold ">{provider?.name}</span>
                  </Typography>
                  <div className="flex gap-2 font-thin text-[12px] items-center">
                    <span>{t('tasks:views')}:</span>
                    <span>
                      {provider?.user_provider?.views_today || provider.view_limit_per_day}/
                      {provider.view_limit_per_day}
                    </span>
                  </div>
                  <div className="flex items-center font-thin text-gray-400 text-[12px]">
                    <span>Token: {provider?.price}</span>
                    <CurrencyDollarIcon className="size-4" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCreateShortLink(provider.id)}
                  disabled={loadingProviderId === provider.id}
                  className="flex items-center justify-center text-sm w-20 gap-1 rounded text-[16px] text-white bg-green-400 hover:bg-green-500 py-1 px-2 disabled:opacity-50"
                >
                  {loadingProviderId === provider.id ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <>
                      <ArrowTopRightOnSquareIcon className="size-5" />
                      <span>{t('tasks:go_to')}</span>
                    </>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
