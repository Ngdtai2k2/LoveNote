import React, { useEffect, useState } from 'react';

const MatrixRain = () => {
  const canvasRef = React.useRef(null);
  const letters = '♥ILOVEYOU♥';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'red';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = i * fontSize;
        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 w-full h-full" />;
};

const WordDisplay = ({ words = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        const next = (currentIndex + 1) % words.length;
        setCurrentIndex(next);
        setFade(true);
      }, 300);
    }, words[currentIndex].duration);

    return () => clearTimeout(timer);
  }, [currentIndex, words]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div
        className={`font-bitcount text-red-600 text-[50px] md:text-[150px] font-bold transition-all duration-300 ease-in-out ${
          fade ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        {words[currentIndex].text}
      </div>
    </div>
  );
};

const MatrixRainWithWords = () => {
  const wordList = [
    { text: '3', duration: 1000 },
    { text: '2', duration: 1000 },
    { text: '1', duration: 1000 },
    { text: 'I LOVE YOU', duration: 3000 },
    { text: 'SO MUCH', duration: 3000 },
    { text: '♥', duration: 3000 },
  ];

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <MatrixRain />
      <WordDisplay words={wordList} />
    </div>
  );
};

export default MatrixRainWithWords;
