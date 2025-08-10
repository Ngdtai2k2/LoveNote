import React, { useEffect, useState } from 'react';

import BUYMEACOFFEE_LOGO from '@assets/svg/buymeacoffeelogo.svg';
import helperFunctions from '@helpers';
import { ClipboardIcon } from '@heroicons/react/24/solid';
import {
  Avatar,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

import useWebConfig from '@hooks/useWebConfig';

export default function DonateModal({ open, handleOpen }) {
  const [webData, setWebData] = useState({});

  const { t, i18n } = useTranslation(['navbar', 'form']);
  const { webConfigs, loading: configLoading } = useWebConfig();

  useEffect(() => {
    if (configLoading || !webConfigs.length) return;
    const getValue = (key) => webConfigs.find((item) => item.key === key)?.value;
    setWebData({
      donate_note: getValue('donate_note'),
      donate_info: getValue('donate_info'),
    });
  }, [webConfigs, configLoading]);

  const bankDonate = [
    {
      label: webData?.donate_info?.bank_name,
      copyValue: webData?.donate_info?.bank_name,
    },
    {
      label: webData?.donate_info?.bank_account,
      copyValue: webData?.donate_info?.bank_account,
    },
  ];

  return (
    <Dialog open={open} handler={handleOpen} size="xs" className="dark:bg-gray-800">
      <DialogHeader className="flex justify-center pb-1 dark:text-gray-200">
        {t('navbar:donate')}
      </DialogHeader>
      <DialogBody className="pt-1">
        <p className="text-sm text-center text-gray-700 dark:text-gray-200 mb-4">
          {webData?.donate_note?.[i18n.language]}
        </p>
        <div className="flex justify-center mb-3">
          <Avatar
            alt="Bank QR"
            variant="square"
            className="h-40 w-40 shadow-md border bg-gray-800 rounded-lg dark:border-gray-300 p-1"
            src={`https://img.vietqr.io/image/${webData?.donate_info?.bank_name}-${webData?.donate_info?.bank_account}-qr_only.png`}
          />
        </div>
        <div className="flex flex-col items-center gap-2 mb-4">
          {bankDonate.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between w-full max-w-xs px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 shadow-sm"
            >
              <Typography className="font-mono text-sm truncate text-gray-900 dark:text-white">
                {item.label}
              </Typography>
              <Tooltip content={t('form:copy')}>
                <IconButton
                  variant="text"
                  size="sm"
                  onClick={() => helperFunctions.handleCopy(item.copyValue, t)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                >
                  <ClipboardIcon className="w-5 h-5" />
                </IconButton>
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1">
          <a href={webData?.donate_info?.momo_link} target="_blank" rel="noopener noreferrer">
            <IconButton className="bg-[#b0006d] hover:scale-105 transition-transform duration-150">
              <svg
                className="w-5 h-5 fill-white"
                viewBox="0 0 96 87"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M75.5326 0C64.2284 0 55.0651 8.74843 55.0651 19.5409C55.0651 30.3333 64.2284 39.0818 75.5326 39.0818C86.8368 39.0818 96 30.3333 96 19.5409C96 8.74843 86.8368 0 75.5326 0ZM75.5326 27.8805C70.7368 27.8805 66.8403 24.1604 66.8403 19.5818C66.8403 15.0031 70.7368 11.283 75.5326 11.283C80.3283 11.283 84.2248 15.0031 84.2248 19.5818C84.2248 24.1604 80.3283 27.8805 75.5326 27.8805ZM49.1561 14.6761V39.1226H37.3809V14.5535C37.3809 12.7138 35.8394 11.2421 33.9126 11.2421C31.9857 11.2421 30.4442 12.7138 30.4442 14.5535V39.1226H18.669V14.5535C18.669 12.7138 17.1276 11.2421 15.2007 11.2421C13.2739 11.2421 11.7324 12.7138 11.7324 14.5535V39.1226H0V14.6761C0 6.58176 6.89385 0 15.372 0C18.8403 0 22.0089 1.10377 24.5781 2.9434C27.1472 1.10377 30.3586 0 33.7841 0C42.2623 0 49.1561 6.58176 49.1561 14.6761ZM75.5326 47.544C64.2284 47.544 55.0651 56.2925 55.0651 67.0849C55.0651 77.8774 64.2284 86.6258 75.5326 86.6258C86.8368 86.6258 96 77.8774 96 67.0849C96 56.2925 86.8368 47.544 75.5326 47.544ZM75.5326 75.4245C70.7368 75.4245 66.8403 71.7044 66.8403 67.1258C66.8403 62.5472 70.7368 58.827 75.5326 58.827C80.3283 58.827 84.2248 62.5472 84.2248 67.1258C84.2248 71.7044 80.3283 75.4245 75.5326 75.4245ZM49.1561 62.2201V86.6667H37.3809V62.0975C37.3809 60.2579 35.8394 58.7862 33.9126 58.7862C31.9857 58.7862 30.4442 60.2579 30.4442 62.0975V86.6667H18.669V62.0975C18.669 60.2579 17.1276 58.7862 15.2007 58.7862C13.2739 58.7862 11.7324 60.2579 11.7324 62.0975V86.6667H0V62.2201C0 54.1258 6.89385 47.544 15.372 47.544C18.8403 47.544 22.0089 48.6478 24.5781 50.4874C27.1472 48.6478 30.3158 47.544 33.7841 47.544C42.2623 47.544 49.1561 54.1258 49.1561 62.2201Z" />
              </svg>
            </IconButton>
          </a>
          <a
            href={webData?.donate_info?.buymeacoffee_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton className="bg-[#ffdd00] hover:scale-105 transition-transform duration-150">
              <Avatar className="h-5 w-5" src={BUYMEACOFFEE_LOGO} />
            </IconButton>
          </a>
        </div>
      </DialogBody>
    </Dialog>
  );
}
