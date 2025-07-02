import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-fox-toast';
import { Link } from 'react-router-dom';

import { ButtonGroup, Button } from '@material-tailwind/react';

import { userSiteAPI } from '@api/userSite';
import { useAxios } from '@hooks/useAxiosJWT';
import Pagination from '@components/Pagination';
import ModalConfirm from './modalConfirm';

export default function SiteTab() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const { t, i18n } = useTranslation(['profile', 'template', 'tabbar']);
  const { axiosJWT } = useAxios(i18n.language);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await userSiteAPI.getSitesByUser(axiosJWT, page, 4);
      setSites(response);
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosJWT, page]);

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    await userSiteAPI.deleteConfigSite(axiosJWT, id);
    getData();
    setLoadingDelete(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('template:copy_success'), {
        position: 'top-right',
      });
    } catch {
      toast.error(t('template:copy_fail'), {
        position: 'top-right',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="py-2 px-1">
      {sites?.data?.length > 0 ? (
        <>
          <ul className="list-none">
            {sites?.data.map((site) => (
              <li key={site.id} className="mb-2">
                <div className="md:flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={site.product.thumbnail_url}
                      alt={site.product.name}
                      className="w-24 h-24 rounded object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-gray-200">{site.product.name}</span>
                      <span
                        className="text-gray-600 dark:text-gray-400 text-sm hover:underline cursor-pointer"
                        onClick={() =>
                          handleCopy(`${import.meta.env.VITE_CLIENT_URL}/${site.slug}`)
                        }
                      >
                        {t('profile:path')}: {import.meta.env.VITE_CLIENT_URL}/{site.slug}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-light italic">
                        {t('profile:created_at')}:{' '}
                        {new Date(site.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end items-center my-2">
                    <ButtonGroup size="sm">
                      <Button className="bg-gray-600 hover:bg-gray-700">
                        <Link to={`/${site.slug}`}>{t('profile:view')}</Link>
                      </Button>
                      {/* handle soon */}
                      <Button
                        className="bg-rose-500 hover:bg-rose-700"
                        onClick={() => setOpenModal(true)}
                        loading={loadingDelete}
                      >
                        {t('profile:delete')}
                      </Button>
                    </ButtonGroup>
                    <ModalConfirm
                      t={t}
                      isOpen={openModal}
                      title={t('profile:confirm_delete_title')}
                      message={t('profile:confirm_delete_message')}
                      onConfirm={() => {
                        handleDelete(site.id);
                        setOpenModal(false);
                      }}
                      onCancel={() => setOpenModal(false)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {sites?.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={page}
                totalPages={sites?.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <p className="dark:text-gray-400 text-gray-600 text-center">{t('profile:no_data')}.</p>
      )}
    </div>
  );
}
