import { Carousel } from '@material-tailwind/react';
import { Link } from 'react-router-dom';

export function BannerSlider({
  banners,
  loading,
  carouselStyles = '',
  imgStyles = '',
  ...carouselProps
}) {
  return (
    <Carousel className={carouselStyles} {...carouselProps}>
      {loading ? (
        <div className="mt-2 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
        </div>
      ) : (
        banners.map((banner) => {
          const imageElement = (
            <img
              key={banner.id}
              src={banner.image}
              alt={banner.title || `banner-${banner.id}`}
              className={imgStyles}
            />
          );

          return banner.link ? (
            <Link to={banner.link} key={banner.id}>
              {imageElement}
            </Link>
          ) : (
            <div key={banner.id}>{imageElement}</div>
          );
        })
      )}
    </Carousel>
  );
}
