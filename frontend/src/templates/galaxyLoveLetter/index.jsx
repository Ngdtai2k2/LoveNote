/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import BlinkingHint from '@components/BlinkingHint';
import SiteStatusPage from '@components/SiteStatusPage';

import IMAGE_DEMO from '../assets/images/image_galaxy_text.jpg';
import MUSIC_DEMO from '../assets/musics/music_background_002.mp3';
import MenuSettings from './menuSettings';

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

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

export default function GalaxyLoveLetter({ data }) {
  const galaxyRef = useRef(null);
  const audioRef = useRef(null);
  const isPlaying = useRef(false);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const activeParticles = useRef(new Set());
  const isInactive =
    data?.is_active === false || (data?.expires_at && new Date(data.expires_at) < new Date());

  const { t } = useTranslation('template');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale] = useState(1);
  const [title, setTitle] = useState('DEMO');

  const defaultSettings = {
    messages: ['Lorem ipsum dolor sit amet!', 'Lorem ipsum dolor sit amet consectetur!'],
    icons: ['💖', '❤️', '💕', '💘'],
    colors: ['#ff6b9d', '#4ecdc4', '#ff69b4'],
    images: [IMAGE_DEMO],
    musicId: data?.music_id || 2,
    audioFile: data?.music?.url
      ? `${import.meta.env.VITE_SERVER_URL}${data.music.url}`
      : MUSIC_DEMO,
    cropToHeart: true,
    audioVolume: 0.5,
  };

  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...data?.configs,
  }));

  const debouncedSettings = useDebouncedValue(settings, 2000);

  const updateSetting = (key, valueOrUpdater) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof valueOrUpdater === 'function' ? valueOrUpdater(prev[key]) : valueOrUpdater,
    }));
  };

  const maxParticles = isSmallMobile ? 60 : isMobile ? 80 : 300;
  const starCount = isSmallMobile ? 120 : isMobile ? 200 : 500;
  const particleInterval = isMobile ? 100 : 120;
  const particleSpeedMultiplier = 1.3;

  const getRandomColor = () =>
    debouncedSettings.colors[Math.floor(Math.random() * debouncedSettings.colors.length)];

  useEffect(() => {
    if (isInactive) return;

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
        star.style.boxShadow = isMobile
          ? `0 0 8px rgba(255,255,255,${brightness})`
          : `0 0 ${6 + Math.random() * 8}px rgba(255, 255, 255, ${brightness})`;
        star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite ease-in-out`;
        galaxy.appendChild(star);
      }
    };

    createStars();
  }, []);

  useEffect(() => {
    if (isInactive) return;

    // set title
    const randomTitle =
      debouncedSettings.messages[Math.floor(Math.random() * debouncedSettings.messages.length)];
    setTitle(randomTitle);

    if (data?.is_active === false) return;

    // create particle
    const galaxy = galaxyRef.current;

    const createParticle = () => {
      if (activeParticles.current.size >= maxParticles) return;
      const el = document.createElement('div');
      const isIcon = Math.random() > 0.7;
      const message = isIcon
        ? debouncedSettings.icons[Math.floor(Math.random() * debouncedSettings.icons.length)]
        : debouncedSettings.messages[Math.floor(Math.random() * debouncedSettings.messages.length)];
      const color = getRandomColor();

      el.className = 'select-none absolute font-semibold pointer-events-none text-[14px]';
      el.style.color = color;
      el.style.textShadow = isMobile ? `0 0 8px ${color}` : `0 0 15px ${color}`;
      el.textContent = message;
      el.style.left = `${Math.random() * 90}%`;
      el.style.fontSize = `${Math.random() * 8 + 14}px`;

      const startY = -150;
      const endY = window.innerHeight + 150;
      const zPos = (Math.random() - 0.5) * (isMobile ? 300 : 500);
      const duration = Math.random() * 2 + 3;
      let startTime = null;

      const animate = (t) => {
        if (!startTime) startTime = t;
        const p = (t - startTime) / (duration * 1000 * particleSpeedMultiplier);
        if (p < 1) {
          el.style.transform = `translate3d(0, ${startY + (endY - startY) * p}px, ${zPos}px)`;
          requestAnimationFrame(animate);
        } else {
          el.remove();
          activeParticles.current.delete(el);
        }
      };

      galaxy.appendChild(el);
      activeParticles.current.add(el);
      requestAnimationFrame(animate);
    };

    const createImageParticle = () => {
      if (!debouncedSettings.images.length || Math.random() >= 0.1) return;
      const img = document.createElement('img');
      img.src =
        debouncedSettings.images[Math.floor(Math.random() * debouncedSettings.images.length)];
      img.className = `absolute pointer-events-none ${debouncedSettings.cropToHeart ? 'heart-shape' : 'rounded'}`;
      img.style.width = `${Math.random() * 40 + 80}px`;
      img.style.left = `${Math.random() * 100}%`;
      const startY = -150;
      const endY = window.innerHeight + 150;
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
    };

    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'absolute bg-white rounded-full';
      star.style.width = '3px';
      star.style.height = '3px';
      star.style.boxShadow = '0 0 30px white';
      star.style.transform = 'rotate(45deg)';
      const startX = Math.random() * window.innerWidth * 0.5;
      const startY = Math.random() * window.innerHeight * 0.3;
      const duration = 1000 + Math.random() * 500;
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      star.style.opacity = 1;
      star.style.transition = `all ${duration}ms linear`;
      galaxy.appendChild(star);
      requestAnimationFrame(() => {
        star.style.left = `${startX + 300}px`;
        star.style.top = `${startY + 150}px`;
        star.style.opacity = 0;
      });
      setTimeout(() => star.remove(), duration + 300);
    };

    const loop = setInterval(() => {
      if (document.hidden) return;
      if (Math.random() < 0.02) createShootingStar();
      createParticle();
      createImageParticle();
    }, particleInterval);

    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 80);
    }

    return () => clearInterval(loop);
  }, [debouncedSettings]);

  // title
  useDocumentTitle(title);

  useEffect(() => {
    if (isInactive) return;

    const getTouch = (e) => e.touches?.[0] || e.changedTouches?.[0];

    const handleMouseDown = (e) => {
      if (e.target.closest('.menu-settings')) return;
      isDragging.current = true;
      const point = e.touches ? getTouch(e) : e;
      lastMouse.current = { x: point.clientX, y: point.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const point = e.touches ? getTouch(e) : e;
      const deltaX = point.clientX - lastMouse.current.x;
      const deltaY = point.clientY - lastMouse.current.y;
      setRotation((prev) => ({
        x: prev.x - deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
      }));
      lastMouse.current = { x: point.clientX, y: point.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleMouseDown);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleMouseDown);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (isInactive) return;

    const audio = audioRef.current;
    audio.volume = settings.audioVolume || 0.5;

    const handleDoubleClick = (e) => {
      if (e.target.closest('.menu-settings')) return;
      if (!audio) return;
      audio.volume = settings.audioVolume || 0.5;

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

    window.addEventListener('dblclick', handleDoubleClick);
    return () => window.removeEventListener('dblclick', handleDoubleClick);
  }, [settings.audioVolume]);

  if (isInactive) {
    return <SiteStatusPage type={!data.is_active ? 'not_active' : 'expired'} />;
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black cursor-pointer"
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
      <audio ref={audioRef} hidden src={settings.audioFile} loop />
      <BlinkingHint hint={t('hint_db_click')} hiddenAfter={5} />
      {!data && <MenuSettings settings={settings} onUpdate={updateSetting} />}
    </div>
  );
}
