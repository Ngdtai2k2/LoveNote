import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDocumentTitle } from '@hooks/useDocumentTitle';

import SiteStatusPage from '@components/SiteStatusPage';
import Popups from './renderEffect/popups';
import MenuSettings from './menuSettings';

import MUSIC from '../assets/musics/tran_bo_nho.mp3';
import { animateParticles } from './renderEffect/animateParticles';

export default function MemoryOverflow({ data }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const particles = useRef([]);
  const previousLyric = useRef('');
  const popupIntervalRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [popups, setPopups] = useState([]);
  const [hideCanvas, setHideCanvas] = useState(false);
  const [showOrientationModal, setShowOrientationModal] = useState(false);

  const { t } = useTranslation('template');

  useDocumentTitle(t('memory_overflow'));

  const defaultSettings = {
    popupTitle: 'demo title',
    popupContent: 'demo content',
    popupIcon: '🧠',
    commonColor: '#fbcfe8',
    popupTitleColor: '#ffffff',
    popupContentColor: '#fbcfe8',
    buttonText: 'PLAY',
  };

  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...data?.configs,
  }));

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    animateParticles({
      canvas,
      ctx,
      audioRef,
      settings,
      started,
      particles,
      previousLyric,
      popupIntervalRef,
      setHideCanvas,
      setPopups,
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [started, settings]);

  useEffect(() => {
    const handleOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowOrientationModal(isPortrait);
    };

    handleOrientation();
    window.addEventListener('resize', handleOrientation);
    return () => window.removeEventListener('resize', handleOrientation);
  }, []);

  const handleStart = () => {
    audioRef.current.play();
    setStarted(true);
  };

  const resetScene = () => {
    setStarted(false);
    setHideCanvas(false);
    setPopups([]);
    previousLyric.current = '';
    particles.current = [];

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (popupIntervalRef.current) {
      clearInterval(popupIntervalRef.current);
      popupIntervalRef.current = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  if (data && (!data.is_active || new Date(data.expires_at) < new Date())) {
    return <SiteStatusPage type={!data.is_active ? 'not_active' : 'expired'} />;
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-10 transition-opacity duration-700 ${
          !started || hideCanvas ? 'opacity-0 pointer-events-none' : ''
        }`}
      />

      <audio ref={audioRef} src={MUSIC} preload="auto" />

      {!started && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-80">
          <label onClick={handleStart}>
            <input className="peer hidden" type="checkbox" />
            <div
              className="group flex w-fit cursor-pointer items-center gap-2 overflow-hidden border rounded-full
               fill-none p-2 px-3 font-extrabold transition-all active:scale-90"
              style={{
                color: settings.commonColor,
                borderColor: settings.commonColor,
              }}
            >
              <div className="z-10 transition group-hover:translate-x-4">{settings.buttonText}</div>
              <svg
                className="size-6 transition duration-500 group-hover:scale-[3000%]"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </div>
          </label>
        </div>
      )}

      <Popups popups={popups} settings={settings} />

      {showOrientationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xs text-center">
            <div className="text-2xl mb-4">📱</div>
            <p
              className="font-semibold text-base"
              style={{
                color: settings.commonColor,
              }}
            >
              {t('rotate_scene')}
            </p>
          </div>
        </div>
      )}

      {!data && <MenuSettings settings={settings} onUpdate={updateSetting} onOpen={resetScene} />}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
