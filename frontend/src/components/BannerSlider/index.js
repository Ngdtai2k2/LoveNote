import PropTypes from 'prop-types';
import { Carousel } from '@material-tailwind/react';

export function BannerSlider({ images, carouselStyles = '', imgStyles = '', ...carouselProps }) {
  return (
    <Carousel className={carouselStyles} {...carouselProps}>
      {images.map((src, index) => (
        <img key={index} src={src} alt={`slide ${index + 1}`} className={imgStyles} />
      ))}
    </Carousel>
  );
}

BannerSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  imgStyles: PropTypes.string,
  carouselStyles: PropTypes.string,
};
