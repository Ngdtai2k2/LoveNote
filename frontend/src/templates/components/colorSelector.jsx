import React, { useState } from 'react';

import { PlusIcon } from '@heroicons/react/24/solid';

export default function ColorSelector({ label, value = [], onChange, max = 10 }) {
  const [currentColor, setCurrentColor] = useState('#ff69b4');

  const addColor = () => {
    if (value.length >= max) return;
    const newColors = Array.from(new Set([...value, currentColor]));
    onChange(newColors);
  };

  const removeColor = (colorToRemove) => {
    const newColors = value.filter((c) => c !== colorToRemove);
    onChange(newColors);
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm text-white">{label}</label>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-10 h-10 rounded border-none cursor-pointer"
        />
        <button
          type="button"
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 cursor-pointer"
          onClick={addColor}
          disabled={value.length >= max}
        >
          <PlusIcon className="size-4" />
        </button>
        <span className="text-xs text-gray-300">
          {value.length}/{max}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((color, idx) => (
          <div
            key={idx}
            className="relative w-7 h-7 rounded-full border border-white"
            style={{ backgroundColor: color }}
            title={color}
          >
            <button
              type="button"
              className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-black text-white rounded-full hover:bg-red-500"
              onClick={() => removeColor(color)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
