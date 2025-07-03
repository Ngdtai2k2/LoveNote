import { useEffect, useState } from 'react';

export default function WordDisplay({
  words = [],
  fontFamily,
  textColor,
  loop = true,
  textFontSize,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!words.length) return;

    const timer = setTimeout(() => {
      setFade(false);

      setTimeout(() => {
        const isLast = currentIndex === words.length - 1;
        if (!loop && isLast) return;
        const next = loop ? (currentIndex + 1) % words.length : currentIndex + 1;
        setCurrentIndex(next);
        setFade(true);
      }, 300);
    }, words[currentIndex].duration || 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, words, loop]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div
        style={{
          fontFamily: fontFamily || 'Tektur',
          color: textColor || '#00ff00',
          fontSize: textFontSize || '100px',
        }}
        className={`font-[800] text-[50px] md:text-[150px] select-none transition-all duration-300 ease-in-out ${
          fade ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        {words[currentIndex].text}
      </div>
    </div>
  );
}
