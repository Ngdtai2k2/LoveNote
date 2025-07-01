import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function BlinkingHint({ hint, hiddenAfter }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, hiddenAfter * 1000);

    return () => clearTimeout(timeout);
  }, [hiddenAfter]);

  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="bg-black/70 text-center text-white text-sm px-4 py-2 rounded-full animate-pulse shadow-lg">
        {hint}
      </div>
    </div>
  );
}
