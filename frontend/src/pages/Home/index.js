import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-tailwind/react';

import { BannerSlider } from '@components/BannerSlider';
import { ProductCard } from '@components/ProductCard';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { getAll } from '@api/product';
import CONSTANTS from '@constants';

export default function Home() {
  const { t } = useTranslation(['product', 'navbar', 'notfound']);

  useDocumentTitle(t('navbar:home'));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAll(CONSTANTS.PAGE, CONSTANTS.LIMIT);
        setProducts(res.data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
          {loading ? (
            <div className="w-8 h-8 border-4 border-t-gray-800 border-gray-300 rounded-full animate-spin"></div>
          ) : products?.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product.id}
                image={product.thumbnail_url}
                title={product.name}
                description={product.description}
                rating={product.rating}
                // isFavorite={}
              />
            ))
          ) : (
            <p className="text-gray-500">{t('notfound:product')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
