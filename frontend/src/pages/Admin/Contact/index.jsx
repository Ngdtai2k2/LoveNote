import React, { useEffect, useState } from 'react';

import helperFunctions from '@helpers';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

import { contactAPI } from '@api/admin/contact';

import { useAxios } from '@hooks/useAxiosJWT';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import DataTable from '@components/DataTable';

export default function ContactManager() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  });
  const [loadingId, setLoadingId] = useState(null);

  // modal confirm state
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  useDocumentTitle(t('contact.title'));

  const getAll = async () => {
    try {
      setLoading(true);
      const res = await contactAPI.getAll(axiosJWT, { page, limit: 8 });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (data?.hasNextPage) setPage(page + 1);
  };

  const deleteData = async (id) => {
    setLoadingId(id);
    try {
      const res = await contactAPI.delete(axiosJWT, id);
      if (res.status === 200) {
        setData((prevData) => ({
          ...prevData,
          data: prevData.data.filter((item) => item.id !== id),
        }));
      }
    } finally {
      setLoadingId(null);
      setOpenConfirm(false);
    }
  };

  const handleOpenConfirm = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteData(selectedId);
    }
  };

  const columns = [
    { label: 'contact.id', key: 'id', width: '80px' },
    { label: 'contact.name', key: 'name' },
    { label: 'contact.email', key: 'email' },
    { label: 'contact.message', key: 'message' },
    {
      label: 'contact.created_at',
      key: 'created_at',
      render: (data) => (
        <Typography className="font-normal text-blue-gray-900 dark:text-blue-gray-100">
          {helperFunctions.formatDateTime(data.created_at)}
        </Typography>
      ),
    },
    {
      label: 'contact.actions',
      key: 'actions',
      render: (data) => (
        <div className="flex gap-2">
          <Button className="w-20" size="sm" color="red" onClick={() => handleOpenConfirm(data.id)}>
            {t('contact.delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-blue-gray-900 dark:text-gray-100">
        {t('contact.title')}
      </Typography>

      {loading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto" />
      ) : (
        <>
          <DataTable columns={columns} data={data.data} t={t} />

          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-4 dark:border-gray-700 dark:text-gray-200">
            <Typography variant="small" className="font-normal">
              {t('table.page_of', {
                currentPage: data.currentPage,
                totalPages: data.totalPages,
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
                {t('table.previous')}
              </Button>
              <Button
                variant="outlined"
                size="sm"
                disabled={!data.hasNextPage}
                onClick={handleNext}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {t('table.next')}
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={openConfirm} handler={() => setOpenConfirm(false)}>
        <DialogHeader>{t('contact.confirm_title')}</DialogHeader>
        <DialogBody>
          <Typography>{t('contact.confirm_message')}</Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfirm(false)}
            className="mr-2"
          >
            {t('table.cancel')}
          </Button>
          <Button color="red" onClick={handleConfirmDelete} disabled={loadingId === selectedId}>
            {loadingId === selectedId ? (
              <div className="h-4 w-4 mx-auto animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              t('contact.delete')
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
