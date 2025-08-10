import React from 'react';

import helperFunctions from '@helpers';
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

import { paymentAPI } from '@api/payment';

import { useAxios } from '@hooks/useAxiosJWT';

export default function ModalRenderLink({ isOpen, onClose, path, payload }) {
  const { t, i18n } = useTranslation('template');

  const url = `${import.meta.env.VITE_CLIENT_URL}/${path}`;

  const { axiosJWT } = useAxios(i18n.language);

  const handleCheckout = async () => {
    const res = await paymentAPI.createPaymentLink(axiosJWT, {
      description: payload.description,
      transactionId: payload.transactionId,
    });

    if (res.status === 200) {
      window.location.href = res.data.paymentLink;
    }
  };

  return (
    <Dialog size="xs" open={isOpen} handler={onClose} className="dark:bg-gray-800">
      <DialogHeader className="flex justify-center text-center dark:text-gray-200">
        {t('successfully_created_web')}
      </DialogHeader>
      <DialogBody className="flex flex-col items-center gap-3">
        <Card className="w-full max-w-xs p-3 border border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-300 rounded-lg shadow">
          <Tooltip content={url} placement="bottom">
            <Typography
              as="p"
              variant="small"
              className="text-center truncate text-blue-700 dark:text-blue-200"
            >
              {helperFunctions.shortenUrl(url, 40)}
            </Typography>
          </Tooltip>
        </Card>
        {payload.description && payload.transactionId && (
          <Typography
            as="p"
            variant="small"
            className="text-center text-yellow-500 font-semibold flex"
          >
            {t('template_payment_note')}
          </Typography>
        )}
      </DialogBody>
      <DialogFooter className="flex justify-center gap-4">
        <Button variant="gradient" color="blue" onClick={() => helperFunctions.handleCopy(url, t)}>
          <span>{t('Copy link')}</span>
        </Button>
        {payload.description && payload.transactionId ? (
          <Button variant="gradient" color="green" onClick={() => handleCheckout()}>
            <span>{t('checkouts')}</span>
          </Button>
        ) : (
          <Button variant="gradient" color="green" onClick={() => (window.location.href = url)}>
            <span>{t('redirect')}</span>
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}
