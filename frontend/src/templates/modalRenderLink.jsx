import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function ModalRenderLink({ isOpen, onClose, path }) {
  const [message, setMessage] = useState();
  const { t } = useTranslation('template');
  const url = `${import.meta.env.VITE_CLIENT_URL}/${path}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage(t('copy_success'));
    } catch {
      setMessage(t('copy_fail'));
    }
  };

  return (
    <Dialog size="xs" open={isOpen} handler={onClose} className="dark:bg-gray-800">
      <DialogHeader className="flex justify-center dark:text-gray-200 outline-slate-200">
        {t('successfully_created_web')}
      </DialogHeader>
      <DialogBody>
        <Alert
          variant="outlined"
          className="py-2 px-3 flex justify-center dark:text-gray-200"
        >
          <span>{url}</span>
        </Alert>
        <span className="flex justify-center text-green-500 dark:text-green-300 text-xs mt-1">{message}</span>
      </DialogBody>
      <DialogFooter className="flex justify-center gap-2">
        <Link
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          to={url}
        >
          {t('redirect')}
        </Link>
        <Button variant="gradient" color="green" onClick={handleCopy}>
          <span>{t('Copy link')}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
