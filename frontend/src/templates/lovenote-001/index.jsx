import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function LoveNoteTemplate({
  text = 'DEMO',
  color = '#ff69b4',
  backgroundColor = 'black',
  fontSize = 16,
  title = 'DEMO',
}) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const columns = Math.floor(canvasSize.width / (fontSize * 4));
    const drops = new Array(columns).fill(1);
    let particles = [];

    ctx.font = `${fontSize}px monospace`;
    let frameCount = 0;

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.fillStyle = color;

      if (frameCount % 2 === 0) {
        for (let i = 0; i < drops.length; i++) {
          const x = i * fontSize * 4;
          const y = drops[i] * fontSize;
          ctx.fillText(text, x, y);

          if (y > canvasSize.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else {
        for (let i = 0; i < drops.length; i++) {
          const x = i * fontSize * 4;
          const y = drops[i] * fontSize;
          ctx.fillText(text, x, y);
        }
      }

      frameCount++;
    };

    const drawParticles = () => {
      particles.forEach((p, index) => {
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = color;
        ctx.fillText(text, p.x, p.y);
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

    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleClick = (e) => {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          alpha: 1,
          size: fontSize + Math.random() * 8,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [canvasSize, text, color, fontSize]);

  return (
    <div
      className="relative h-screen w-screen cursor-pointer overflow-hidden"
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute left-0 top-0 z-0"
      />
      <div className="pointer-events-none absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center">
        <h1 className="font-mono text-4xl opacity-80" style={{ color }}>
          {title}
        </h1>
      </div>
    </div>
  );
}

LoveNoteTemplate.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  fontSize: PropTypes.number,
  title: PropTypes.string,
};
