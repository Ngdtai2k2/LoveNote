import helperFunctions from '@helpers';

import { lyricsData } from '../lyricsData';
import { generateTargetPoints } from './generateTargetPoints';

export function animateParticles({
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
}) {
  const commonColorWithOpacity = helperFunctions.hexToRgba(settings.commonColor, 0.5);

  const now = audioRef.current?.currentTime || 0;
  const currentLyric = lyricsData.find((l) => now >= l.start && now <= l.end);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentLyric && previousLyric.current !== currentLyric.lyrics) {
    const targets = generateTargetPoints(currentLyric.lyrics, canvas, settings.commonColor);
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
    ctx.shadowColor = commonColorWithOpacity;
    ctx.shadowBlur = 8;
    ctx.fillStyle = settings.commonColor;
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
    }, 150);
  }

  requestAnimationFrame(() =>
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
    })
  );
}
