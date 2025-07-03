import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDocumentTitle } from '@hooks/useDocumentTitle';

import Popups from './popups';
import { lyricsData } from './lyricsData';
import { generateTargetPoints } from './canvasUtils';

import MUSIC from '../assets/musics/tran_bo_nho.mp3';

export default function MemoryOverflow() {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const animate = () => {
      const now = audioRef.current?.currentTime || 0;
      const currentLyric = lyricsData.find((l) => now >= l.start && now <= l.end);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentLyric && previousLyric.current !== currentLyric.lyrics) {
        const targets = generateTargetPoints(currentLyric.lyrics, canvas);
        const maxLen = Math.max(particles.current.length, targets.length);
        const newParticles = [];

        for (let i = 0; i < maxLen; i++) {
          const target = targets[i % targets.length] || {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
          };

          const p = particles.current[i] || {
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
          };

          newParticles.push({
            x: p.x,
            y: p.y,
            vx: p.vx,
            vy: p.vy,
            tx: target.x,
            ty: target.y,
          });
        }

        particles.current = newParticles;
        previousLyric.current = currentLyric.lyrics;
      }

      // Move particles
      particles.current.forEach((p) => {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.06;
        p.vy += dy * 0.06;
        p.vx *= 0.7;
        p.vy *= 0.7;
        p.x += p.vx;
        p.y += p.vy;

        ctx.save();
        ctx.shadowColor = 'rgba(255, 192, 203, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      const lastLyricEnd = lyricsData[lyricsData.length - 1].end;
      if (started && now >= lastLyricEnd && !popupIntervalRef.current) {
        setHideCanvas(true);
        popupIntervalRef.current = setInterval(() => {
          for (let i = 0; i < 8; i++) {
            const id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            setPopups((prev) => [...prev, { id, left, top }]);

            setTimeout(() => {
              setPopups((prev) => prev.filter((p) => p.id !== id));
            }, 3000);
          }
        }, 300);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [started]);

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
              className="group flex w-fit cursor-pointer items-center gap-2 overflow-hidden border rounded-full border-pink-200
               fill-none p-2 px-3 font-extrabold text-pink-200 transition-all active:scale-90 peer-checked:fill-pink-200
               peer-checked:hover:text-white"
            >
              <div className="z-10 transition group-hover:translate-x-4">PLAY</div>
              <svg
                className="size-6 transition duration-500 group-hover:scale-[1100%]"
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

      <Popups popups={popups} />

      {showOrientationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xs text-center">
            <div className="text-2xl mb-4">📱</div>
            <p className="text-pink-500 font-semibold text-base">{t('rotate_scene')}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
