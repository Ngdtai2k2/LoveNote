import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BlinkingHint from '@components/BlinkingHint';

import IMAGE_DEMO from '../assets/images/image_galaxy_text.jpg';
import MUSIC_DEMO from '../assets/musics/music_background_002.mp3';

const galaxyData = {
  messages: [
    'Thank you for being my sunshine',
    'You are my universe',
    'You make my heart smile',
    'Honey bunch, you are my everything!',
  ],
  icons: ['♥', '💖', '❤️', '💕', '💘'],
  colors: ['#ff6b9d', '#4ecdc4', '#ff69b4', '#f34bce', '#ff99cc', '#ff85a1', '#ffb3de', '#ff6fd8'],
  images: [IMAGE_DEMO],
  song: MUSIC_DEMO,
};

function getRandomColor() {
  return galaxyData.colors[Math.floor(Math.random() * galaxyData.colors.length)];
}

const injectTwinkle = () => {
  const styleId = 'twinkle-keyframe';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
};

export default function GalaxyTest() {
  const galaxyRef = useRef(null);
  const audioRef = useRef(null);
  const isPlaying = useRef(false);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const activeParticles = useRef(new Set());

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale] = useState(1);

  const { t } = useTranslation('template');

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const maxParticles = isSmallMobile ? 150 : isMobile ? 200 : 300;
  const particleInterval = isMobile ? 100 : 120;
  const starCount = isSmallMobile ? 250 : isMobile ? 350 : 500;
  const particleSpeedMultiplier = 1.3;

  useEffect(() => {
    injectTwinkle();
    const galaxy = galaxyRef.current;

    const createStars = () => {
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'absolute w-[2px] h-[2px] bg-white rounded-full';
        const angle = Math.random() * Math.PI * 10;
        const r = Math.random() * (isMobile ? 800 : 1500) + 300;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * 150 + (Math.random() - 0.5) * 1500;
        const z = Math.sin(angle) * r * 0.5;
        star.style.left = `calc(50% + ${x}px)`;
        star.style.top = `calc(50% + ${y}px)`;
        star.style.transform = `translateZ(${z}px)`;
        const brightness = 0.8 + Math.random() * 0.5;
        star.style.boxShadow = `0 0 ${6 + Math.random() * 8}px rgba(255, 255, 255, ${brightness})`;
        star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite ease-in-out`;
        galaxy.appendChild(star);
      }
    };

    const createShootingStar = () => {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'absolute bg-white rounded-full';
      shootingStar.style.width = '3px';
      shootingStar.style.height = '3px';
      shootingStar.style.boxShadow = '0 0 30px white';
      shootingStar.style.transform = 'rotate(45deg)';
      const startX = Math.random() * window.innerWidth * 0.5;
      const startY = Math.random() * window.innerHeight * 0.3;
      const duration = 1000 + Math.random() * 500;
      shootingStar.style.left = `${startX}px`;
      shootingStar.style.top = `${startY}px`;
      shootingStar.style.opacity = 1;
      shootingStar.style.transition = `all ${duration}ms linear`;

      galaxy.appendChild(shootingStar);

      requestAnimationFrame(() => {
        shootingStar.style.left = `${startX + 300}px`;
        shootingStar.style.top = `${startY + 150}px`;
        shootingStar.style.opacity = 0;
      });

      setTimeout(() => shootingStar.remove(), duration + 300);
    };

    const createTextParticle = () => {
      if (activeParticles.current.size >= maxParticles) return;
      const el = document.createElement('div');
      const isIcon = Math.random() > 0.7;
      const message = isIcon
        ? galaxyData.icons[Math.floor(Math.random() * galaxyData.icons.length)]
        : galaxyData.messages[Math.floor(Math.random() * galaxyData.messages.length)];
      const color = getRandomColor();

      el.className = `absolute font-semibold pointer-events-none text-[14px]`;
      el.style.color = color;
      el.style.textShadow = `0 0 15px ${color}`;
      el.textContent = message;

      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${Math.random() * 8 + 14}px`;
      el.style.opacity = 1;

      const startY = -150,
        endY = window.innerHeight + 150;
      const zPos = (Math.random() - 0.5) * (isMobile ? 300 : 500);
      const duration = Math.random() * 2 + 3;

      let startTime = null;
      function animate(t) {
        if (!startTime) startTime = t;
        const p = (t - startTime) / (duration * 1000 * particleSpeedMultiplier);
        if (p < 1) {
          el.style.transform = `translate3d(0, ${startY + (endY - startY) * p}px, ${zPos}px)`;
          requestAnimationFrame(animate);
        } else {
          el.remove();
          activeParticles.current.delete(el);
        }
      }
      galaxy.appendChild(el);
      activeParticles.current.add(el);
      requestAnimationFrame(animate);
    };

    const loop = setInterval(() => {
      if (Math.random() < 0.02) createShootingStar();
      if (galaxyData.images.length && Math.random() < 0.1) {
        const img = document.createElement('img');
        img.src = galaxyData.images[Math.floor(Math.random() * galaxyData.images.length)];
        img.className = 'absolute rounded pointer-events-none';
        img.style.width = `${Math.random() * 40 + 60}px`;
        img.style.left = `${Math.random() * 100}%`;
        const startY = -150,
          endY = window.innerHeight + 150;
        const zPos = (Math.random() - 0.5) * (isMobile ? 300 : 500);
        const duration = Math.random() * 2 + 3;
        let startTime = null;
        function animate(t) {
          if (!startTime) startTime = t;
          const p = (t - startTime) / (duration * 1000);
          if (p < 1) {
            img.style.transform = `translate3d(0, ${startY + (endY - startY) * p}px, ${zPos}px)`;
            requestAnimationFrame(animate);
          } else {
            img.remove();
            activeParticles.current.delete(img);
          }
        }
        galaxy.appendChild(img);
        activeParticles.current.add(img);
        requestAnimationFrame(animate);
      } else {
        createTextParticle();
      }
    }, particleInterval);

    for (let i = 0; i < 15; i++) {
      setTimeout(() => createTextParticle(), i * 80);
    }

    createStars();
    return () => clearInterval(loop);
  }, []);

  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastMouse.current.x;
      const deltaY = e.clientY - lastMouse.current.y;
      setRotation((prev) => ({ x: prev.x - deltaY * 0.5, y: prev.y + deltaX * 0.5 }));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleDoubleClick = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = 0.5;

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
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ fontFamily: 'Orbitron, Courier New, monospace' }}
    >
      <div
        ref={galaxyRef}
        className="absolute top-1/2 left-1/2 w-full h-full"
        style={{
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
          perspective: '1500px',
        }}
      />
      <audio ref={audioRef} hidden src={galaxyData.song} />
      <BlinkingHint hint={t('hint_db_click')} hiddenAfter={5} />
    </div>
  );
}
