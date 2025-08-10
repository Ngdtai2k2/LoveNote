import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Button, Tooltip, IconButton } from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useAxios } from '@hooks/useAxiosJWT';

import helperFunctions from '@helpers';
import { shortenerProvider } from '@api/admin/shortenerProvider';
import DataTable from '@components/DataTable';
import ModalEdit from './modalEdit';

export default function ShortenerProviderManager() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState({
    data: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const { t, i18n } = useTranslation(['admin', 'template']);
  const { axiosJWT } = useAxios(i18n.language);

  useDocumentTitle(t('provider.title'));

  const getAllProviders = async () => {
    try {
      setLoading(true);
      const res = await shortenerProvider.getAll(axiosJWT, { page, limit: 10 });
      setProviders(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (providers?.hasNextPage) setPage(page + 1);
  };

  const handleEditClick = (provider) => {
    setSelectedProvider(provider);
    setOpenModalEdit(true);
  };

  const columns = [
    { label: 'admin:provider.name', key: 'name' },
    {
      label: 'admin:provider.base_url',
      key: 'base_url',
      render: (provider) => {
        const url = provider.base_url || '';
        const shortUrl = url.length > 30 ? `${url.slice(0, 15)}...${url.slice(-10)}` : url;

        return (
          <Tooltip content={url} className="max-w-xs break-words">
            <Typography
              onClick={() => helperFunctions.handleCopy(url, t)}
              className="font-normal text-blue-gray-900 dark:text-blue-gray-100 cursor-pointer"
            >
              {shortUrl}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      label: 'admin:provider.api_key',
      key: 'api_key',
      render: (provider) => (
        <Tooltip content={provider.api_key} className="max-w-xs break-words">
          <Typography
            onClick={() => helperFunctions.handleCopy(provider.api_key, t)}
            className="font-normal text-blue-gray-900 dark:text-blue-gray-100 cursor-pointer"
          >
            {'*'.repeat(8)}
          </Typography>
        </Tooltip>
      ),
    },
    {
      label: 'admin:provider.view_limit_per_day',
      key: 'view_limit_per_day',
    },
    { label: 'admin:provider.price', key: 'price' },
    {
      label: 'admin:provider.created_at',
      key: 'created_at',
      render: (provider) => (
        <Typography className="font-normal text-blue-gray-900 dark:text-blue-gray-100">
          {helperFunctions.formatDateTime(provider.created_at)}
        </Typography>
      ),
    },
    {
      label: 'admin:provider.actions',
      key: 'actions',
      render: (provider) => (
        <div className="flex gap-2">
          <IconButton color="yellow" onClick={() => handleEditClick(provider)}>
            <PencilIcon className="h-4 w-4 text-white" />
          </IconButton>
          <IconButton color="red">
            <TrashIcon className="h-4 w-4 text-white" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-blue-gray-900 dark:text-gray-100">
        {t('admin:provider.title')}
      </Typography>

      {loading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto" />
      ) : (
        <>
          <DataTable columns={columns} data={providers.data} t={t} />

          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-4 dark:border-gray-700 dark:text-gray-200">
            <Typography variant="small" className="font-normal">
              {t('admin:table.page_of', {
                currentPage: providers.currentPage,
                totalPages: providers.totalPages,
              })}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="sm"
                disabled={page <= 1}
                onClick={handlePrevious}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {t('admin:table.previous')}
              </Button>
              <Button
                variant="outlined"
                size="sm"
                disabled={!providers.hasNextPage}
                onClick={handleNext}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {t('admin:table.next')}
              </Button>
            </div>
          </div>
        </>
      )}

      {openModalEdit && (
        <ModalEdit
          data={selectedProvider}
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
        />
      )}
    </div>
  );
}
