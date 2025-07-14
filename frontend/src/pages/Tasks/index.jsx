import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Typography } from '@material-tailwind/react';
import { ArrowTopRightOnSquareIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

import { shortenerProviderAPI } from '@api/shortenerProvider';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useAxios } from '@hooks/useAxiosJWT';
import { taskAPI } from '@api/task';

export default function Tasks() {
  const [providers, setProviders] = useState([]);

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
    const res = await taskAPI.createShortLinks(axiosJWT, providerId);

    if (res?.data?.url) {
      window.location.href = res.data.url;
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
                  <span className="text-[16px] font-bold py-0 my-0 leading-tight">
                    {provider?.name}
                  </span>
                  <div className="py-1.5 flex items-center font-thin text-gray-400 text-[13px] italic">
                    <span>Token: {provider?.price}</span>
                    <CurrencyDollarIcon className="size-4" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCreateShortLink(provider.id)}
                  className="flex items-center text-sm w-20 gap-1 rounded text-[16px] text-white bg-green-400 hover:bg-green-500 py-1 px-2"
                >
                  <ArrowTopRightOnSquareIcon className="size-5" />
                  <span>{t('tasks:go_to')}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
