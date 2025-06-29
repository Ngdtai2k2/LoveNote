import MatrixLoveRain from '@templates/matrixLoveRain';
import HeartBeatVisualizer from '@templates/heartBeatVisualizer';
import GalaxyLoveLetter from '@templates/galaxyLoveLetter';

const templateRoutes = [
  {
    path: '/matrix-love-rain',
    element: <MatrixLoveRain />,
  },
  // test route
  {
    path: '/galaxy-love-letter',
    element: <GalaxyLoveLetter />,
  },
  {
    path: '/heart-beat-visualizer',
    element: <HeartBeatVisualizer />,
  },
];

export default templateRoutes;
