import { useEffect } from 'react';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { paymentAPI } from '@api/public/payment';

import { useAxios } from '@hooks/useAxiosJWT';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function Cancel() {
  const { t, i18n } = useTranslation('payment');

  useDocumentTitle(t('cancel'));

  const { axiosJWT } = useAxios(i18n.language);

  const urlParams = new URLSearchParams(window.location.search);
  const orderCode = urlParams.get('orderCode');

  const handleCancelPayment = async (orderCode) => {
    await paymentAPI.cancelPayment(axiosJWT, orderCode);
  };

  useEffect(() => {
    handleCancelPayment(orderCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode]);

  return (
    <div className="my-10 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md text-center max-w-md">
        <XCircleIcon className="w-32 h-32 text-red-500 dark:text-red-400 mx-auto" />
        <h1 className="text-2xl font-bold mt-4 text-red-700 dark:text-red-400">{t('cancel')}!</h1>
        <p className="text-gray-600 dark:text-gray-200 mt-2">{t('cancel_note')}</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
