import React, { useEffect, useState } from 'react';

import IMAGE_DEMO from '../assets/images/image_galaxy_text.jpg';
import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';

const BloomGalaxy = () => {
  const [musicUrl, setMusicUrl] = useState(null);

  useEffect(() => {
    const selectedSrc = MUSIC_DEMO;

    const ringTexts = ['LOVENOTE', 'BLOOM GALAXY', 'LOVE NOTE', '2025'];

    window.dataCCD = {
      heartAudio: selectedSrc,
      ringTexts: ringTexts,
      heartImages: [IMAGE_DEMO],
    };

    setMusicUrl(selectedSrc);

    import('./module/index.js').then((module) => {
      if (module.default) {
        module.default();
      }
    });
  }, []);

  return (
    <>
      {musicUrl && (
        <audio id="bg-music" autoPlay loop>
          <source src={musicUrl} type="audio/mpeg" />
        </audio>
      )}
      <div id="container"></div>
      <div id="dark-overlay"></div>
      <div id="info"></div>
    </>
  );
};

export default BloomGalaxy;
