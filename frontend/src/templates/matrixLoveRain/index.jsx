import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import MenuSettings from './menuSettings';
import helperFunctions from '@helpers';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import MUSIC_BACKGROUND_001 from '../assets/musics/music_background_001.mp3';
import BlinkingHint from '@components/BlinkingHint';

export default function MatrixLoveRain({ data }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const isPlaying = useRef(false);
  const { t } = useTranslation('template');

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // configs default
  const [settings, setSettings] = useState({
    textRain: data?.configs?.textRain || 'DEMO',
    title: data?.configs?.title || 'DEMO',
    fontSize: data?.configs?.fontSize || 16,
    fontSizeTitle: data?.configs?.fontSizeTitle || 50,
    textColor: data?.configs?.textColor || '#ff69b4',
    backgroundHex: data?.configs?.backgroundHex || '#000000',
    backgroundOpacity: data?.configs?.backgroundOpacity || 0.05,
    titleColor: data?.configs?.titleColor || '#ff69b4',
    rainSpeed: data?.configs?.rainSpeed || 1,
    textPerClick: data?.configs?.textPerClick || 8,
    autoBurst: data?.configs?.autoBurst || false,
    playAudio: data?.configs?.playAudio || false,
    audioVolume: data?.configs?.audioVolume || 0.5,
    audioFile: data?.configs?.audioFile || MUSIC_BACKGROUND_001,
  });

  useDocumentTitle(settings?.title);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const textClick = useCallback(
    (particles, x, y) => {
      const particleCount = Number(settings.textPerClick) || 8;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          alpha: 1,
          size: settings.fontSize + Math.random() * 8,
        });
      }
    },
    [settings.textPerClick, settings.fontSize]
  );

  useEffect(() => {
    const backgroundColor = helperFunctions.hexToRgba(
      settings.backgroundHex,
      settings.backgroundOpacity
    );
    const rainSpeed = Number(settings.rainSpeed) || 1;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const safeFontSize = Number(settings.fontSize) > 0 ? Number(settings.fontSize) : 16;
    const columns = Math.floor(canvasSize.width / (safeFontSize * 4));
    const drops = new Array(columns).fill(1);
    let particles = [];

    ctx.font = `${settings.fontSize}px monospace`;
    let frameCount = 0;

    const drawMatrix = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.fillStyle = settings.textColor;

      if (frameCount % 2 === 0) {
        for (let i = 0; i < drops.length; i++) {
          const x = i * settings.fontSize * 4;
          const y = drops[i] * settings.fontSize;
          ctx.fillText(settings.textRain, x, y);

          if (y > canvasSize.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += rainSpeed;
        }
      } else {
        for (let i = 0; i < drops.length; i++) {
          const x = i * settings.fontSize * 4;
          const y = drops[i] * settings.fontSize;
          ctx.fillText(settings.textRain, x, y);
        }
      }

      frameCount++;
    };

    const drawParticles = () => {
      particles.forEach((p, index) => {
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = settings.textColor;
        ctx.fillText(settings.textRain, p.x, p.y);
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.01;
        if (p.alpha <= 0) particles.splice(index, 1);
      });
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      drawMatrix();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    let autoBurstInterval = null;

    if (settings.autoBurst) {
      autoBurstInterval = setInterval(() => {
        const x = Math.random() * canvasSize.width;
        const y = Math.random() * canvasSize.height;

        textClick(particles, x, y);
      }, 1000);
    }

    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleClick = (e) => {
      textClick(particles, e.clientX, e.clientY);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
      if (autoBurstInterval) clearInterval(autoBurstInterval);
    };
  }, [canvasSize, settings, textClick]);

  // audio
  useEffect(() => {
    const handleDoubleClick = () => {
      const audio = audioRef.current;
      if (!audio || !settings.playAudio) return;

      audio.volume = settings.audioVolume ?? 1;

      if (!isPlaying.current) {
        audio
          .play()
          .then(() => {
            isPlaying.current = true;
          })
          .catch((err) => {
            console.warn('🔇 Play bị chặn:', err);
          });
      } else {
        audio.pause();
        isPlaying.current = false;
      }
    };

    window.addEventListener('dblclick', handleDoubleClick);
    return () => window.removeEventListener('dblclick', handleDoubleClick);
  }, [settings.playAudio, settings.audioVolume]);

  return (
    <div className="relative h-screen w-screen cursor-pointer overflow-hidden">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute left-0 top-0 z-0"
      />
      <audio
        ref={audioRef}
        src={settings.audioFile || MUSIC_BACKGROUND_001}
        loop
        style={{ display: 'none' }}
      />
      <div className="pointer-events-none absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center">
        <h1
          className="font-mono opacity-80"
          style={{
            color: settings.titleColor,
            fontSize: `${settings.fontSizeTitle}px`,
          }}
        >
          {settings.title}
        </h1>
      </div>
      {settings.playAudio && <BlinkingHint hint={t('hint_db_click')} hiddenAfter={5} />}

      {!data && (
        <MenuSettings settings={settings} onUpdate={(key, value) => updateSetting(key, value)} />
      )}
    </div>
  );
}
