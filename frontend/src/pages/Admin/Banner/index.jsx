import React, { useEffect, useState } from 'react';

import helperFunctions from '@helpers';
import { Button, Chip, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

import { bannerAPI } from '@api/admin/banner';

import { useAxios } from '@hooks/useAxiosJWT';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import DataTable from '@components/DataTable';

export default function BannerManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerList, setBannerList] = useState({
    data: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  });
  const [processingBannerId, setProcessingBannerId] = useState(null);

  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  useDocumentTitle(t('banner.title'));

  const fetchBannerList = async () => {
    try {
      setIsLoading(true);
      const res = await bannerAPI.getAll(axiosJWT, { page: currentPage, limit: 5 });
      setBannerList(res);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (bannerList?.hasNextPage) setCurrentPage(currentPage + 1);
  };

  const toggleBannerActiveStatus = async (bannerId) => {
    setProcessingBannerId(bannerId);
    try {
      const response = await bannerAPI.activated(axiosJWT, bannerId);
      if (response.status === 200) {
        setBannerList((prev) => ({
          ...prev,
          data: prev.data.map((banner) =>
            banner.id === bannerId ? { ...banner, is_active: !banner.is_active } : banner
          ),
        }));
      }
    } finally {
      setProcessingBannerId(null);
    }
  };

  const columns = [
    { label: 'banner.id', key: 'id', width: '80px' },
    {
      label: 'banner.b_title',
      key: 'title',
      render: (banner) => (
        <Typography className="font-normal text-blue-gray-900 dark:text-blue-gray-100">
          {banner.title || '---'}
        </Typography>
      ),
    },
    {
      label: 'banner.image',
      key: 'image',
      render: (banner) => (
        <img
          className="w-40 rounded-lg"
          src={helperFunctions.renderUrlServer(banner.image)}
          alt={banner.title}
        />
      ),
    },
    {
      label: 'banner.link',
      key: 'link',
    },
    {
      label: 'banner.active',
      key: 'active',
      render: (banner) => (
        <Chip
          variant="ghost"
          size="sm"
          value={banner.is_active ? t('banner.active') : t('banner.not_activated')}
          color={banner.is_active ? 'green' : 'red'}
          className="dark:text-gray-200"
        />
      ),
    },
    {
      label: 'banner.created_at',
      key: 'created_at',
      render: (banner) => (
        <Typography className="font-normal text-blue-gray-900 dark:text-blue-gray-100">
          {helperFunctions.formatDateTime(banner.created_at)}
        </Typography>
      ),
    },
    {
      label: 'table.actions',
      key: 'actions',
      render: (banner) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            color={banner.is_active ? 'red' : 'green'}
            onClick={() => toggleBannerActiveStatus(banner.id)}
            disabled={processingBannerId === banner.id}
          >
            {processingBannerId === banner.id ? (
              <div className="h-4 w-4 mx-auto animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : banner.is_active ? (
              t('banner.deactivate')
            ) : (
              t('banner.active')
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-blue-gray-900 dark:text-gray-100">
        {t('banner.title')}
      </Typography>

      {isLoading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto" />
      ) : (
        <>
          <DataTable columns={columns} data={bannerList.data} t={t} />

          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-4 dark:border-gray-700 dark:text-gray-200">
            <Typography variant="small" className="font-normal">
              {t('table.page_of', {
                currentPage: bannerList.currentPage,
                totalPages: bannerList.totalPages,
              })}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="sm"
                disabled={currentPage <= 1}
                onClick={goToPreviousPage}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {t('table.previous')}
              </Button>
              <Button
                variant="outlined"
                size="sm"
                disabled={!bannerList.hasNextPage}
                onClick={goToNextPage}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {t('table.next')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
