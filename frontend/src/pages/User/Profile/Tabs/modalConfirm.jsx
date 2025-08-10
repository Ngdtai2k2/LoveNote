import React from 'react';

import { Button } from '@material-tailwind/react';

const ModalConfirm = ({ isOpen, onConfirm, onCancel, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div className="z-50 mx-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
          {t('profile:confirm_delete_title')}
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-200">
          {t('profile:confirm_delete_message')}
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {t('tabbar:cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {t('tabbar:confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
