import { useState } from 'react';

import {
  CheckCircleIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { toast } from 'react-fox-toast';
import { useTranslation } from 'react-i18next';

import useCountdown from '@hooks/useCountdown';

import DetailModal from './detailModal';

export default function VoucherCard({ voucher, isRedeemed = false, isLoading = false, onRedeem }) {
  const [openDetail, setOpenDetail] = useState(false);

  const { t, i18n } = useTranslation(['form', 'template']);

  const timeLeft = useCountdown(voucher?.expires_at, t('form:expired'));

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t('template:copy_success'), { position: 'top-right' });
    } catch {
      toast.error(t('template:copy_fail'), { position: 'top-right' });
    }
  };

  const handleOpenDetail = () => setOpenDetail(!openDetail);

  return (
    <>
      <Card
        className={`relative flex flex-row items-center shadow-lg overflow-hidden h-full min-h-[125px] dark:bg-gray-700 ${
          voucher.is_used ? 'opacity-60 grayscale pointer-events-none' : ''
        }`}
      >
        {voucher.is_used && (
          <div className="absolute top-3 right-[-22px] rotate-45 bg-red-500 text-gray-200 dark:text-white text-xs font-bold px-6 py-1 shadow-lg z-10">
            {t('form:used')}
          </div>
        )}

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
              {voucher.name[i18n.language]}
            </Typography>
            <Typography className="text-sm text-gray-900 dark:text-gray-200 line-clamp-2 mb-2">
              {voucher.description[i18n.language]}
            </Typography>

            <Typography className="text-sm italic font-semibold text-gray-900 dark:text-gray-200 mb-2">
              {t('form:applicable')}:
              <span
                className="hover:underline ml-1 text-sm font-light italic cursor-pointer lowercase outline-none focus:outline-none"
                onClick={() => handleOpenDetail()}
              >
                {t('form:details')}
              </span>
            </Typography>

            <Typography
              variant="body2"
              className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2"
            >
              {t('form:expired_after')}:{' '}
              {timeLeft ? (
                timeLeft
              ) : (
                <span className="inline-flex items-center gap-1 align-middle">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              )}
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
              <span className="flex items-center dark:text-blue-400 text-blue-600 font-semibold">
                {Number(voucher.redeem_token_cost).toLocaleString('vi-VN')}
                <CurrencyDollarIcon className="w-5 h-5 mr-1" />
              </span>

              <Button
                size="sm"
                color="blue"
                disabled={isLoading || voucher.is_used}
                onClick={() => onRedeem?.(voucher)}
              >
                {isLoading ? t('form:redeeming') : t('form:redeem')}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <DetailModal open={openDetail} handleOpen={handleOpenDetail} data={voucher} />
    </>
  );
}
