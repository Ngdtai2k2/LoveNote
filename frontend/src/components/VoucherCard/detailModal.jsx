import React from 'react';

import { Avatar, Dialog, DialogBody, DialogHeader, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function DetailModal({ open, handleOpen, data }) {
  const { t, i18n } = useTranslation('form');

  return (
    <Dialog open={open} handler={handleOpen} size="xs" className="dark:bg-gray-700">
      <DialogHeader className="flex justify-center pb-1 dark:text-gray-200">
        {data.name[i18n.language]}
      </DialogHeader>
      <DialogBody className="pt-1 dark:text-gray-200">
        <Typography>{data.description[i18n.language]}</Typography>
        <Typography>{t('form:applicable')}:</Typography>
        {data.products.length > 0 ? (
          <>
            {data.products.map((product, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center ml-2">
                <Avatar src={product.thumbnail_url} className="h-12 w-12" variant="rounded" />
                <Link
                  to={`/${product.slug}`}
                  className="hover:underline outline-none focus:outline-none"
                >
                  {product.name}
                </Link>
              </div>
            ))}
          </>
        ) : (
          <Typography className="text-center italic">{t('form:all_products')}</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
}
