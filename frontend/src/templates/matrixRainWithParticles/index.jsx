import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import BlinkingHint from '@components/BlinkingHint';

import MatrixRain from './matrixRain';
import WordDisplay from './wordDisplay';
import MenuSettings from './menuSettings';

import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';

export default function MatrixRainWithWords({ data }) {
  const { t } = useTranslation('template');
  const audioRef = useRef(null);
  const isPlaying = useRef(false);

  const defaultSettings = {
    title: 'Matrix Rain with Words',
    wordList: [
      { text: 'Demo 1', duration: 1000 },
      {
        text: 'Demo 2',
        duration: 2000,
      },
    ],
    letters: 'abcdefghiklmnopqrstuvwxyz',
    loop: true,
    backgroundColor: '#000000',
    textColor: '#00ff00',
    textFontSize: 100,
    rainTextColor: '#00ff00',
    rainFontSize: 14,
    fontFamily: 'Tektur',
    audioFile: MUSIC_DEMO,
    audioVolume: 0.5,
  };

  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...data?.configs,
  }));

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const debounced = useDebouncedValue(settings, 500);
  useDocumentTitle(debounced.title);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = debounced.audioVolume || 0.5;

    const toggleAudio = (e) => {
      if (e.target.closest('.menu-settings') || !audio) return;

      if (!isPlaying.current) {
        audio
          .play()
          .then(() => (isPlaying.current = true))
          .catch((err) => console.warn('🔇 Play bị chặn:', err));
      } else {
        audio.pause();
        isPlaying.current = false;
      }
    };

    window.addEventListener('dblclick', toggleAudio);
    return () => window.removeEventListener('dblclick', toggleAudio);
  }, [debounced.audioVolume]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <audio ref={audioRef} hidden src={debounced.audioFile} loop />

      <MatrixRain
        letters={debounced.letters}
        rainTextColor={debounced.rainTextColor}
        rainFontSize={debounced.rainFontSize}
        backgroundColor={debounced.backgroundColor}
      />
      <WordDisplay
        words={debounced.wordList}
        loop={debounced.loop}
        fontFamily={debounced.fontFamily}
        textColor={debounced.textColor}
        textFontSize={debounced.textFontSize}
      />

      <BlinkingHint hint={t('hint_db_click')} hiddenAfter={5} />

      {!data && <MenuSettings settings={debounced} onUpdate={updateSetting} />}
    </div>
  );
}
