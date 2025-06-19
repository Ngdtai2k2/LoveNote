import PropTypes from 'prop-types';
import { HeartIcon, StarIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
} from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

export function ProductCard({
  image,
  title,
  description,
  rating,
  onReadMore,
  isFavorite = false,
  onToggleFavorite,
}) {
  const { t } = useTranslation('product');

  return (
    <Card className="w-full max-w-[20rem] shadow-lg dark:bg-gray-900 bg-white">
      <CardHeader floated={false} color="blue-gray">
        <img src={image} alt={title} />
        <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
        <IconButton
          size="sm"
          variant="text"
          className="!absolute top-4 right-4 rounded-full"
          onClick={onToggleFavorite}
        >
          <HeartIcon className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-red-300'}`} />
        </IconButton>
      </CardHeader>

      <CardBody>
        <div className="mb-2 flex items-center justify-between">
          <Typography
            variant="h5"
            className="text-gray-800 dark:text-gray-200 font-bold line-clamp-1"
          >
            {title}
          </Typography>
          <Typography className="flex items-center gap-1.5 font-normal text-gray-800 dark:text-gray-200">
            <StarIcon className="-mt-0.5 h-5 w-5 text-yellow-700" />
            {rating}
          </Typography>
        </div>
        <Typography className="text-gray-800 dark:text-gray-200 line-clamp-2">
          {description}
        </Typography>
      </CardBody>

      <CardFooter className="pt-2">
        <Button
          size="lg"
          fullWidth
          onClick={onReadMore}
          className="text-white rounded transition duration-200 bg-gray-600 hover:bg-gray-800 
            active:bg-gray-800 focus:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-800 
            dark:active:bg-gray-800 dark:focus:bg-gray-800"
        >
          {t('card.read_more')}
        </Button>
      </CardFooter>
    </Card>
  );
}

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReadMore: PropTypes.func,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
};
