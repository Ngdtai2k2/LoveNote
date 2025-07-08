import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-tailwind/react';

import { BannerSlider } from '@components/BannerSlider';
import { ProductCard } from '@components/ProductCard';
import Pagination from '@components/Pagination';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import useBanner from '@hooks/useBanner';
import { productAPI } from '@api/product';
import CONSTANTS from '@constants';

export default function Home() {
  const { t } = useTranslation(['product', 'navbar', 'notfound']);
  const navigate = useNavigate();

  useDocumentTitle(`${CONSTANTS.SITE_NAME} - ${t('navbar:home')}`);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { banners, loading: bannerLoading } = useBanner();

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll(page, CONSTANTS.LIMIT);
      setProducts(res);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const onReadMore = (slug) => {
    navigate(`/${slug}`);
  };

  return (
    //  carousel
    <div className="mx-auto mt-2 max-w-screen-xl">
      <BannerSlider
        banners={banners}
        loading={bannerLoading}
        imgStyles="md:h-96 w-full object-cover"
        carouselStyles="rounded-xl"
        autoplay
        loop
      />
      {/* list product */}
      <div className="mx-auto mt-3 max-w-screen-xl md:mt-5">
        <Typography
          variant="h4"
          className="mb-3 flex justify-center text-gray-800 dark:text-gray-200"
        >
          {t('product:products')}
        </Typography>
        <div className="flex flex-wrap justify-center gap-2">
          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
          ) : products?.data?.length > 0 ? (
            <>
              {products?.data?.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.thumbnail_url}
                  title={product.name}
                  description={product.description}
                  rating={product.rating}
                  onReadMore={() => onReadMore(product.slug)}
                />
              ))}

              {products?.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={products?.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">{t('notfound:product')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
