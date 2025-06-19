import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-tailwind/react';

import { BannerSlider } from '@components/BannerSlider';
import { ProductCard } from '@components/ProductCard';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function Home() {
  const { t } = useTranslation(['product', 'navbar']);

  useDocumentTitle(t('navbar:home'));

  // data test
  const imageList = [
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80',
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=2762&q=80',
  ];

  return (
    //  carousel
    <div className="mt-2 mx-auto max-w-screen-xl">
      <BannerSlider
        images={imageList}
        imgStyles="h-96 w-full object-cover"
        carouselStyles="rounded-xl"
        autoplay
        loop
      />
      {/* list product */}
      <div className="mt-3 md:mt-5 mx-auto max-w-screen-xl">
        <Typography
          variant="h4"
          className="mb-3 md:mb-5 flex justify-center text-gray-800 dark:text-gray-200"
        >
          {t('product:products')}
        </Typography>
        <div className="flex flex-wrap gap-2 justify-center">
          {/* data test */}
          <ProductCard
            image="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=1470&q=80"
            title="Wooden House, Florida"
            description="Enter a freshly updated and thoughtfully furnished peaceful home surrounded by ancient trees, stone walls, and open meadows."
            rating={5.0}
            isFavorite={true}
          />
        </div>
      </div>
    </div>
  );
}
