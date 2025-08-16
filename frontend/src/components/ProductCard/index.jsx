import helperFunctions from '@helpers';
import { StarIcon } from '@heroicons/react/24/solid';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

export function ProductCard({ image, title, description, rating, price, onReadMore }) {
  const { t } = useTranslation('product');

  return (
    <Card className="flex h-full w-full max-w-[20rem] flex-col bg-white shadow-lg dark:bg-gray-900">
      <CardHeader floated={false} color="blue-gray" className="relative">
        <img
          src={helperFunctions.renderUrlServer(image)}
          alt={title}
          className="h-60 w-full object-cover object-center"
        />
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
          <button
            onClick={onReadMore}
            className="relative w-full group border-none bg-transparent p-0 outline-none cursor-pointer font-sans font-medium uppercase text-sm"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"></span>
            <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-gray-800 via-gray-700 to-gray-900"></span>
            <div className="relative flex items-center justify-between py-2 px-4 text-sm text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 gap-2 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
              <span className="select-none">{t('card.create_web')}</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 ml-1 transition duration-250 group-hover:translate-x-1"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                />
              </svg>
            </div>
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
