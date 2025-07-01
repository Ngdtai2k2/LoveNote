import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createHeartScene } from './createHeartScene';
import BlinkingHint from '@components/BlinkingHint';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useDebouncedValue } from '@hooks/useDebouncedValue';

// shader file glsl
import heartVertex from './shaders/heartVertex.glsl';
import heartFragment from './shaders/heartFragment.glsl';
import snowVertex from './shaders/snowVertex.glsl';
import snowFragment from './shaders/snowFragment.glsl';
import MenuSettings from './menuSettings';

import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';

export default function HeartBeatVisualizer({ data }) {
  const canvasRef = useRef();
  const audioBtnRef = useRef();
  const h1Ref = useRef();

  const { t } = useTranslation('template');

  const defaultSettings = {
    text: 'DEMO',
    textColor: '#ff99cc',
    heartColor: ['#ff66cc', '#ff99ff', '#ffccff', '#ff3366', '#ffffff'],
    snowColor: ['#ff66cc', '#ff99ff', '#ffccff', '#ffffff'],
    modelColor: '#ff3366',
    buttonColor: '#ff99cc',
    audioFile: MUSIC_DEMO,
    audioVolume: 0.5,
  };

  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...data?.configs,
  }));
  
  const sceneSettingsRaw = useMemo(() => {
    const { text, buttonColor, textColor, ...rest } = settings; // eslint-disable-line no-unused-vars
    return rest;
  }, [settings]);

  const debouncedSceneSettings = useDebouncedValue(sceneSettingsRaw, 1000);

  const updateSetting = (key, valueOrUpdater) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof valueOrUpdater === 'function' ? valueOrUpdater(prev[key]) : valueOrUpdater,
    }));
  };

  useDocumentTitle(settings.text);

  useEffect(() => {
    const scene = createHeartScene(
      canvasRef.current,
      audioBtnRef.current,
      heartVertex,
      heartFragment,
      snowVertex,
      snowFragment,
      debouncedSceneSettings
    );

    return () => {
      scene?.dispose();
    };
  }, [debouncedSceneSettings]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#1a0d1a] to-[#2b0f2b]">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full outline-none" />
      <h1
        ref={h1Ref}
        className="absolute top-4 left-8 right-8 text-center text-5xl opacity-0 animate-fadeIn use-select-none"
        style={{
          color: settings.textColor,
          textShadow: `0 0 10px ${settings.textColor}, 0 0 20px ${settings.textColor}`,
        }}
      >
        {settings.text}
      </h1>
      <button
        ref={audioBtnRef}
        type="button"
        aria-label="Play music"
        style={{
          borderColor: settings.buttonColor,
          color: settings.buttonColor,
        }}
        className="flex justify-center absolute top-0 bottom-0 left-0 right-0 m-auto h-[10vh] w-[10vh]
        border-2 rounded-full cursor-pointer transition-all duration-300 shadow-pink hover:bg-pink/20 hover:scale-110"
      >
        <svg className="w-[4vh]" fill="currentColor" viewBox="0 0 512 512" title="music">
          <path d="M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z" />
        </svg>
      </button>

      <BlinkingHint hint={t('hint_click_player')} hiddenAfter={5} />
      {!data && <MenuSettings settings={settings} onUpdate={updateSetting} />}
    </div>
  );
}
