import MatrixLoveRain from '@templates/matrixLoveRain';
import GalaxyText from '@templates/galaxyText';
import HeartAnimation from '@templates/heartAnimation';

const templateRoutes = [
  {
    path: '/matrix-love-rain',
    element: <MatrixLoveRain />,
  },
  // test route
  {
    path: '/galaxy-text',
    element: <GalaxyText />,
  },
    {
    path: '/heart-animation',
    element: <HeartAnimation />,
  },
];

export default templateRoutes;
