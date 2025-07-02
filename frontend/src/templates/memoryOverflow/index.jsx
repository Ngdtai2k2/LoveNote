import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDocumentTitle } from '@hooks/useDocumentTitle';

import MUSIC_DEMO from '../assets/musics/tran_bo_nho.mp3';

const lyricsData = [
  { lyrics: 'Nỗi nhớ em cầu kỳ', start: 0, end: 1.2 },
  { lyrics: 'Nên chẳng biết lý do là gì?', start: 1.2, end: 3.3 },
  { lyrics: 'Hao tốn hơn nhiều G', start: 3.3, end: 5 },
  { lyrics: 'Nên cần dùng thêm USB', start: 5, end: 7.3 },
  { lyrics: 'Nỗi nhớ em cầu kỳ', start: 7.3, end: 8.8 },
  { lyrics: 'nên chẳng biết lý do là gì', start: 8.8, end: 11.3 },
  { lyrics: 'Hao tốn hơn nhiều G', start: 11.3, end: 12.3 },
  { lyrics: 'Nên cần', start: 12.3, end: 13 },
  { lyrics: 'D', start: 13.0, end: 13.33 },
  { lyrics: 'O', start: 13.33, end: 13.66 },
  { lyrics: 'M', start: 13.66, end: 14.0 },
  { lyrics: 'I', start: 14.0, end: 14.33 },
  { lyrics: 'C', start: 14.33, end: 15.0 },
];

export default function MemoryOverflow() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [popups, setPopups] = useState([]);
  const particles = useRef([]);
  const previousLyric = useRef('');
  const popupIntervalRef = useRef(null);
  const [hideCanvas, setHideCanvas] = useState(false);

  const { t } = useTranslation('template');

  useDocumentTitle(t('memory_overflow'));

  function generateTargetPoints(text, canvas) {
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;

    const fontSize = Math.floor(window.innerWidth * 0.07);
    offCtx.font = `bold ${fontSize}px sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#fff';
    offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
    const points = [];

    const step = window.innerWidth < 600 ? 4 : 3;
    for (let y = 0; y < offCanvas.height; y += step) {
      for (let x = 0; x < offCanvas.width; x += step) {
        const index = (y * offCanvas.width + x) * 4;
        const alpha = imageData[index + 3];
        if (alpha > 128) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }

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
        ctx.shadowColor = 'rgba(255, 192, 203, 0.8)';
        ctx.shadowBlur = 12;
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
            const id = Date.now() + Math.random();
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            setPopups((prev) => [...prev, { id, left, top }]);

            setTimeout(() => {
              setPopups((prev) => prev.filter((p) => p.id !== id));
            }, 2300);
          }
        }, 100);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [started]);

  useEffect(() => {
    const handleOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait) alert('📱 Vui lòng xoay ngang màn hình để xem karaoke!');
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

      <audio ref={audioRef} src={MUSIC_DEMO} preload="auto" />

      {!started && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-80">
          <label class="">
            <input class="peer hidden" checked="" type="checkbox" onClick={handleStart} />
            <div
              class="group flex w-fit cursor-pointer items-center gap-2 overflow-hidden border rounded-full border-pink-200
               fill-none p-2 px-3 font-extrabold text-pink-200 transition-all active:scale-90 peer-checked:fill-pink-200
               peer-checked:hover:text-white"
            >
              <div class="z-10 transition group-hover:translate-x-4">PLAY</div>
              <svg
                class="size-6 transition duration-500 group-hover:scale-[1100%]"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                ></path>
              </svg>
            </div>
          </label>
        </div>
      )}

      {/* Popup I Miss You */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          style={{
            position: 'absolute',
            left: `${popup.left}%`,
            top: `${popup.top}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'fadeOut 2.5s ease-out forwards',
            width: 220,
          }}
          className="z-40 bg-white border border-gray-500 rounded shadow-md overflow-hidden text-sm pointer-events-none"
        >
          <div className="bg-pink-300 text-white px-3 py-1 font-bold flex items-center justify-between">
            <span>{t('memory_overflow')}</span>
            <span className="text-xs">🧠</span>
          </div>
          <div className="p-4 text-center text-pink-300 font-semibold">I Miss You !</div>
        </div>
      ))}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
