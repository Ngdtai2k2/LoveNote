import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../../node_modules/react-i18next';
import { Typography } from '@material-tailwind/react';

import { BannerSlider } from '@components/BannerSlider';
import { ProductCard } from '@components/ProductCard';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import useBanner from '@hooks/useBanner';
import { getAll } from '@api/product';
import CONSTANTS from '@constants';

export default function Home() {
  const { t } = useTranslation(['product', 'navbar', 'notfound']);

  useDocumentTitle(t('navbar:home'));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { banners, loading: bannerLoading } = useBanner();

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

  return (
    //  carousel
    <div className="mt-2 mx-auto max-w-screen-xl">
      <BannerSlider
        banners={banners}
        loading={bannerLoading}
        imgStyles="md:h-96 w-full object-cover"
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
