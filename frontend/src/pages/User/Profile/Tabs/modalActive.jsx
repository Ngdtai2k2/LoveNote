import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-tailwind/react';
import { CheckCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

import { useCurrentUser } from '@hooks/useCurrentUser';
import { userSiteAPI } from '@api/userSite';
import { paymentAPI } from '@api/payment';
import { useAxios } from '@hooks/useAxiosJWT';

import CONSTANTS from '@constants';

export default function ModalActive({ isOpen, onCancel, data, onGetData }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState();

  const { t, i18n } = useTranslation(['profile', 'template', 'tabbar']);
  const user = useCurrentUser();
  const { axiosJWT } = useAxios(i18n.language);

  if (!isOpen) return null;

  const handleActive = async () => {
    if (!options) return;
    setLoading(true);
    await userSiteAPI.activeSite(axiosJWT, options);
    setLoading(false);
    onCancel();
    onGetData();
  };

  const handleCheckout = async () => {
    if (!data.transaction_id) return;
    const res = await paymentAPI.createPaymentLink(axiosJWT, {
      description: `${user.id}-${data.product.id}`,
      transactionId: data.transaction_id,
    });

    if (res.status === 200) {
      window.location.href = res.data.paymentLink;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="z-50 mx-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-6">
        {data?.has_transaction === false ? (
          <>
            <h2 className="text-xl font-semibold mb-6 dark:text-gray-200 text-center">
              {t('profile:active')}
            </h2>

            <Typography className="font-semibold text-sm flex items-center mb-2">
              Token: {Number(user.wallet.token_balance).toLocaleString('vi-VN')}
              <CurrencyDollarIcon className="ml-1 w-4 h-4 text-yellow-500" />
            </Typography>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center mb-6">
              {CONSTANTS.OPTIONS_ACTIVE.map((opt) => {
                const isSelected = options?.numDays === opt.days;

                return (
                  <div
                    key={opt.days}
                    onClick={() =>
                      !loading &&
                      setOptions({
                        id: data.id,
                        numDays: opt.days,
                        token: opt.token,
                      })
                    }
                    className={`relative cursor-pointer flex flex-col items-center justify-center rounded-xl p-3 transition-all duration-200 text-white
                      ${isSelected ? 'ring-2 ring-white scale-[1.03]' : 'hover:scale-105 opacity-90 hover:opacity-100'}
                      ${loading ? 'pointer-events-none opacity-60' : ''}
                      bg-gradient-to-br ${opt.gradient} shadow-lg`}
                  >
                    {isSelected && (
                      <CheckCircleIcon className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow" />
                    )}

                    <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-md text-xl font-bold shadow-inner">
                      {opt.days}
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <CurrencyDollarIcon className="w-4 h-4 text-white" />
                      <span>{opt.token}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-2 w-full">
              <Button
                size="sm"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                {t('form:cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleActive}
                loading={loading}
                disabled={!options || loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {t('form:confirm')}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-row items-center md:items-start gap-4 text-left">
            <img
              src={data.product?.thumbnail_url}
              alt={data.product?.name}
              className="w-24 h-24 object-cover rounded-lg shadow-md"
            />
            <div className="flex flex-col justify-between h-full">
              <h2 className="text-sm font-semibold dark:text-gray-200 mb-2">
                {data.product?.name}
              </h2>
              <h2 className="text-sm font-semibold dark:text-gray-200 mb-2">
                {t('product:price')}: {Number(data.total_amount).toLocaleString('vi-VN')}đ
              </h2>
              <div className="flex gap-1">
                <Button size="sm" onClick={onCancel} className="flex-1 bg-red-500 hover:bg-red-600">
                  {t('form:cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleCheckout}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {t('template:checkouts')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
