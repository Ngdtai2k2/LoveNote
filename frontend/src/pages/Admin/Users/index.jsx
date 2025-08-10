import React, { useEffect, useState } from 'react';

import helperFunctions from '@helpers';
import { Button, Chip, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

import { usersAPI } from '@api/admin/users';

import { useAxios } from '@hooks/useAxiosJWT';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import DataTable from '@components/DataTable';

export default function UsersManager() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [users, setUsers] = useState({
    data: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  });
  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  useDocumentTitle(t('users.title'));

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.allUsers(axiosJWT, { page, limit: 10 });
      setUsers(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (users?.hasNextPage) setPage(page + 1);
  };

  const bannedUser = async (id) => {
    setLoadingId(id);
    try {
      const response = await usersAPI.banned(axiosJWT, id);
      if (response.status === 200) {
        setUsers((prev) => ({
          ...prev,
          data: prev.data.map((u) => (u.id === id ? { ...u, is_banned: !u.is_banned } : u)),
        }));
      }
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    { label: 'users.id', key: 'id', width: '80px' },
    { label: 'users.full_name', key: 'full_name' },
    { label: 'users.email', key: 'email' },
    {
      label: 'users.status',
      key: 'is_banned',
      render: (user) => (
        <Chip
          variant="ghost"
          size="sm"
          value={user.is_banned ? t('users.banned') : t('users.active')}
          color={user.is_banned ? 'red' : 'green'}
          className="dark:text-gray-200"
        />
      ),
    },
    {
      label: 'users.created_at',
      key: 'created_at',
      render: (user) => (
        <Typography className="font-normal text-blue-gray-900 dark:text-blue-gray-100">
          {helperFunctions.formatDateTime(user.created_at)}
        </Typography>
      ),
    },
    {
      label: 'users.actions',
      key: 'actions',
      render: (user) => (
        <div className="flex gap-2">
          <Button
            className="w-20"
            size="sm"
            color={user.is_banned ? 'gray' : 'red'}
            onClick={() => bannedUser(user.id)}
            disabled={loadingId === user.id}
          >
            {loadingId === user.id ? (
              <div className="h-4 w-4 mx-auto animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : user.is_banned ? (
              t('users.unban')
            ) : (
              t('users.ban')
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-blue-gray-900 dark:text-gray-100">
        {t('users.title')}
      </Typography>

      {loading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto" />
      ) : (
        <>
          <DataTable columns={columns} data={users.data} t={t} />

          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-4 dark:border-gray-700 dark:text-gray-200">
            <Typography variant="small" className="font-normal">
              {t('table.page_of', {
                currentPage: users.currentPage,
                totalPages: users.totalPages,
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
                disabled={!users.hasNextPage}
                onClick={handleNext}
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
