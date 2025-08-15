import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import BlinkingHint from '@components/BlinkingHint';
import SiteStatusPage from '@components/SiteStatusPage';

import IMAGE_DEMO from '../assets/images/image_galaxy_text.jpg';
import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';
import MenuSettings from './menuSettings.jsx';

export default function BloomGalaxy({ data }) {
  const containerRef = useRef(null);
  const [musicUrl, setMusicUrl] = useState(null);

  const isInactive =
    data?.is_active === false || (data?.expires_at && new Date(data.expires_at) < new Date());

  const { t } = useTranslation('template');

  useDocumentTitle(t('bloom_galaxy'));

  const defaultSettings = {
    ringTexts: ['HEARTIFY', 'BLOOM GALAXY', 'HEARTIFY SITE', '2025'],
    heartAudio: MUSIC_DEMO,
    heartImages: [IMAGE_DEMO],
    musicId: data?.music_id || 4,
  };

  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...data?.configs,
    heartAudio: data?.music?.url
      ? `${import.meta.env.VITE_SERVER_URL}${data.music.url}`
      : MUSIC_DEMO,
    heartImages: data?.configs?.images || [IMAGE_DEMO],
  }));

  const debouncedSettings = useDebouncedValue(settings, 2000);

  const updateSetting = (key, valueOrUpdater) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof valueOrUpdater === 'function' ? valueOrUpdater(prev[key]) : valueOrUpdater,
    }));
  };

  const clearContainer = () => {
    if (containerRef.current) {
      containerRef.current.replaceChildren();
    }
  };

  useEffect(() => {
    if (isInactive) return;

    document.body.style.overflow = 'hidden';
    clearContainer();

    window.containerTarget = containerRef.current;
    window.dataCCD = {
      heartAudio: debouncedSettings.heartAudio,
      ringTexts: debouncedSettings.ringTexts,
      heartImages: debouncedSettings.heartImages,
    };
    setMusicUrl(debouncedSettings.heartAudio);

    let moduleRef = null;

    import('./module/index.js').then((module) => {
      moduleRef = module;
      if (typeof module.default === 'function') {
        module.default();
      }
    });

    const handleDoubleClick = () => {
      const audioEl = document.getElementById('bg-music');
      if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
        audioEl.remove();
      }

      if (window.galaxyAudio) {
        window.galaxyAudio.pause();
        window.galaxyAudio.currentTime = 0;
        window.galaxyAudio = null;
      }

      clearContainer();

      import('./module/index.js').then((module) => {
        if (typeof module.default === 'function') {
          module.default();
        }
      });
    };

    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('dblclick', handleDoubleClick);
      document.body.style.overflow = '';

      const audioEl = document.getElementById('bg-music');
      if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
        audioEl.remove();
      }

      if (window.galaxyAudio) {
        window.galaxyAudio.pause();
        window.galaxyAudio.currentTime = 0;
        window.galaxyAudio = null;
      }

      clearContainer();

      if (moduleRef?.disposeGalaxy) {
        moduleRef.disposeGalaxy();
      }
    };
  }, [debouncedSettings, isInactive]);

  if (isInactive) {
    return <SiteStatusPage type={!data.is_active ? 'not_active' : 'expired'} />;
  }

  return (
    <>
      {musicUrl && (
        <audio id="bg-music" loop>
          <source src={musicUrl} type="audio/mpeg" />
        </audio>
      )}

      <div ref={containerRef} className="overflow-hidden overscroll-none w-full h-full"></div>

      <BlinkingHint hint={t('hint_bloom_galaxy')} hiddenAfter={7} />
      {!data && <MenuSettings settings={settings} onUpdate={updateSetting} />}
    </>
  );
}
