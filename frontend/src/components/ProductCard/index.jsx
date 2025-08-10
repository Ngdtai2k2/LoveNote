import { StarIcon } from '@heroicons/react/24/solid';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

export function ProductCard({ image, title, description, rating, price, onReadMore }) {
  const { t } = useTranslation('product');

  return (
    <Card className="flex h-full w-full max-w-[20rem] flex-col bg-white shadow-lg dark:bg-gray-900">
      <CardHeader floated={false} color="blue-gray" className="relative">
        <img src={image} alt={title} className="h-60 w-full object-cover object-center" />
        <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
      </CardHeader>

      <CardBody className="flex flex-1 flex-col">
        <div className="mb-1 flex items-center justify-between">
          <Typography
            variant="h6"
            className="line-clamp-1 font-bold text-gray-900 dark:text-gray-200"
          >
            {title}
          </Typography>
          <Typography className="flex items-center gap-1.5 font-normal text-gray-900 dark:text-gray-200">
            <StarIcon className="-mt-0.5 h-5 w-5 text-yellow-300" />
            {rating}
          </Typography>
        </div>
        <Typography className="text-[15px] font-semibold text-gray-900 dark:text-gray-200">
          {t('price')}: {Number(price).toLocaleString('vi-VN')}đ
        </Typography>
        <Typography className="line-clamp-3 min-h-[2rem] text-sm text-gray-900 dark:text-gray-200">
          {description}
        </Typography>
        <div className="mt-auto pt-4">
          <Button
            size="lg"
            fullWidth
            onClick={onReadMore}
            className="rounded bg-gray-600 text-white transition duration-200 hover:bg-gray-800 
          focus:bg-gray-800 active:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-800 
          dark:focus:bg-gray-800 dark:active:bg-gray-800"
          >
            {t('card.create_web')}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
