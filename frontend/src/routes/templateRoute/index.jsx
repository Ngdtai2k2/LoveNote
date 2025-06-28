import MatrixLoveRain from '@templates/matrixLoveRain';
import GalaxyText from '@templates/galaxyText';
import HeartBeatVisualizer from '@templates/heartBeatVisualizer';

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
    path: '/heart-beat-visualizer',
    element: <HeartBeatVisualizer />,
  },
];

export default templateRoutes;
