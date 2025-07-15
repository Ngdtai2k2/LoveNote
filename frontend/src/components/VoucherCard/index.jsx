import React from 'react';
import { toast } from 'react-fox-toast';

import { Card, Typography, Button, IconButton, Tooltip } from '@material-tailwind/react';
import {
  TicketIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function VoucherCard({ voucher, isRedeemed = false, isLoading = false, onRedeem }) {
  const { t } = useTranslation(['form', 'template']);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t('template:copy_success'), { position: 'top-right' });
    } catch {
      toast.error(t('template:copy_fail'), { position: 'top-right' });
    }
  };

  return (
    <Card className="flex flex-row items-center shadow-lg overflow-hidden h-full min-h-[150px] dark:bg-gray-700">
      <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full m-4 shrink-0">
        {isRedeemed ? (
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        ) : (
          <TicketIcon className="w-8 h-8 text-blue-600" />
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 h-full pr-4 py-4">
        <div>
          <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-1">
            {voucher.name}
          </Typography>
          <Typography className="text-sm text-gray-700 dark:text-gray-400 line-clamp-2 mb-2">
            {voucher.description}
          </Typography>

          {isRedeemed && voucher.code && (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md w-fit">
              <Typography className="font-mono text-sm text-gray-900 dark:text-white">
                {voucher.code}
              </Typography>
              <Tooltip content={t('form:copy')}>
                <IconButton
                  variant="text"
                  size="sm"
                  onClick={() => handleCopy(voucher.code)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ClipboardIcon className="w-5 h-5" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>

        {!isRedeemed && (
          <div className="flex items-center justify-between mt-4 ml-1">
            <span className="flex items-center text-blue-600 font-semibold">
              {Number(voucher.tokenCost).toLocaleString('vi-VN')}
              <CurrencyDollarIcon className="w-5 h-5 mr-1" />
            </span>

            <Button size="sm" color="blue" disabled={isLoading} onClick={() => onRedeem?.(voucher)}>
              {isLoading ? t('form:redeeming') : t('form:redeem')}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
