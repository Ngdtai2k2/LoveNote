import React, { useEffect, useRef } from 'react';

import { createHeartScene } from './createHeartScene';
import BlinkingHint from '@components/BlinkingHint';

// shader file glsl
import heartVertex from './shaders/heartVertex.glsl';
import heartFragment from './shaders/heartFragment.glsl';
import snowVertex from './shaders/snowVertex.glsl';
import snowFragment from './shaders/snowFragment.glsl';
import { useTranslation } from 'react-i18next';

const HeartScene = () => {
  const canvasRef = useRef();
  const audioBtnRef = useRef();
  const h1Ref = useRef();

  const { t } = useTranslation('template');

  useEffect(() => {
    createHeartScene(
      canvasRef.current,
      audioBtnRef.current,
      heartVertex,
      heartFragment,
      snowVertex,
      snowFragment
    );
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#1a0d1a] to-[#2b0f2b]">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full outline-none" />
      <h1
        ref={h1Ref}
        className="absolute top-4 left-8 right-8 text-center text-5xl
        text-[#ffccff] opacity-0 animate-fadeIn shadow-pink"
      >
        DEMO
      </h1>
      <button
        ref={audioBtnRef}
        type="button"
        aria-label="Play music"
        className="flex justify-center absolute top-0 bottom-0 left-0 right-0 m-auto h-[10vh] w-[10vh] border-2 
        border-[#ff99cc] rounded-full cursor-pointer transition-all duration-300 shadow-pink hover:bg-pink/20 hover:scale-110"
      >
        <svg
          className="w-[4vh] text-[#ffccff]"
          fill="currentColor"
          viewBox="0 0 512 512"
          title="music"
        >
          <path d="M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z" />
        </svg>
      </button>
      <BlinkingHint hint={t('hint_click_player')} hiddenAfter={5} />
    </div>
  );
};

export default HeartScene;
