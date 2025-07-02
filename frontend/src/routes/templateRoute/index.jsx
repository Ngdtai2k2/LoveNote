import MatrixLoveRain from '@templates/matrixLoveRain';
import HeartBeatVisualizer from '@templates/heartBeatVisualizer';
import GalaxyLoveLetter from '@templates/galaxyLoveLetter';
import MatrixRainWithParticles from '@templates/matrixRainWithParticles';
import MemoryOverflow from '../../templates/memoryOverflow';

const templateRoutes = [
  {
    path: '/matrix-love-rain',
    element: <MatrixLoveRain />,
  },
  {
    path: '/galaxy-love-letter',
    element: <GalaxyLoveLetter />,
  },
  {
    path: '/heart-beat-visualizer',
    element: <HeartBeatVisualizer />,
  },
  {
    path: '/matrix-rain-text',
    element: <MatrixRainWithParticles />,
  },
    {
    path: '/memory-overflow',
    element: <MemoryOverflow />,
  },
];

export default templateRoutes;
