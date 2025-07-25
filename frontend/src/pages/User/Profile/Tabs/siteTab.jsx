import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { userSiteAPI } from '@api/userSite';
import { useAxios } from '@hooks/useAxiosJWT';
import Pagination from '@components/Pagination';
import helperFunctions from '@helpers';

import ModalConfirm from './modalConfirm';
import { Typography } from '@material-tailwind/react';
import ModalActive from './modalActive';

export default function SiteTab() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [selectedForActivate, setSelectedForActivate] = useState(null);

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
    setSelectedForDelete(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      setPage(newPage);
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
      <div className="text-red-500 mb-3">
        <Typography className="text-xs font-semibold italic">
          *{t('profile:inactive_note')}
        </Typography>
        <Typography className="text-xs font-semibold italic">
          *{t('profile:expired_note')}
        </Typography>
      </div>

      {sites?.data?.length > 0 ? (
        <ul className="list-none">
          {sites?.data.map((site) => {
            const isExpired = site.expires_at && new Date(site.expires_at) < new Date();

            return (
              <li key={site.id} className="mb-2">
                <div className="md:flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="relative w-24 h-24">
                      <img
                        src={site.product.thumbnail_url}
                        alt={site.product.name}
                        className={`w-full h-full rounded object-cover ${
                          !site.is_active || isExpired ? 'grayscale opacity-70' : ''
                        }`}
                      />

                      {isExpired ? (
                        <span className="absolute top-3 left-1 bg-yellow-600 text-white text-[8px] font-semibold px-1 py-0.5 rounded rotate-[-20deg] shadow-md">
                          {t('profile:expired')}
                        </span>
                      ) : (
                        !site.is_active && (
                          <span className="absolute top-3 left-1 bg-red-600 text-white text-[8px] font-semibold px-1 py-0.5 rounded rotate-[-20deg] shadow-md">
                            {t('profile:inactive')}
                          </span>
                        )
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-gray-200">{site.product.name}</span>
                      <span
                        className="text-gray-600 dark:text-gray-400 text-sm hover:underline cursor-pointer"
                        onClick={() =>
                          helperFunctions.handleCopy(
                            `${import.meta.env.VITE_CLIENT_URL}/${site.slug}`,
                            t
                          )
                        }
                      >
                        {t('profile:path')}: {import.meta.env.VITE_CLIENT_URL}/{site.slug}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-light italic">
                        {t('profile:created_at')}:{' '}
                        {new Date(site.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-light italic">
                        {t('profile:expired')}:{' '}
                        {site.expires_at
                          ? helperFunctions.formatDateTime(site.expires_at)
                          : t('profile:indefinite')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end items-center my-2 gap-1">
                    <Link
                      to={`/${site.slug}`}
                      className="px-2 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors"
                    >
                      {t('profile:view')}
                    </Link>

                    <button
                      onClick={() => setSelectedForDelete(site)}
                      disabled={loadingDelete}
                      className={`px-2 py-1 text-sm rounded-md text-white transition-colors ${
                        loadingDelete
                          ? 'bg-red-300 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500'
                      }`}
                    >
                      {loadingDelete ? t('form:deleting') : t('form:delete')}
                    </button>

                    {(!site.is_active || isExpired) && (
                      <button
                        onClick={() => setSelectedForActivate(site)}
                        className="px-2 py-1 text-sm rounded-md text-white bg-green-500 hover:bg-green-600"
                      >
                        {t('profile:active')}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="dark:text-gray-400 text-gray-600 text-center">{t('profile:no_data')}.</p>
      )}

      {sites?.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={page}
            totalPages={sites?.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal riêng biệt */}
      {selectedForDelete && (
        <ModalConfirm
          t={t}
          isOpen={true}
          onConfirm={() => handleDelete(selectedForDelete.id)}
          onCancel={() => setSelectedForDelete(null)}
        />
      )}

      {selectedForActivate && (
        <ModalActive
          onGetData={() => getData()}
          isOpen={true}
          onCancel={() => setSelectedForActivate(null)}
          data={selectedForActivate}
        />
      )}
    </div>
  );
}
