import React from 'react';
import { useInterfaceMode } from '@providers/interfaceMode';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function ToggleMode() {
  const { mode, toggleMode } = useInterfaceMode();
  const isDark = mode === 'dark';

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        className="peer hidden border-none"
        type="checkbox"
        checked={isDark}
        onChange={toggleMode}
      />
      <div
        className={`group peer ring-0 bg-gray-50 dark:bg-gray-500 border-none border-blue-900 rounded-full 
        outline-none duration-700 after:duration-200 w-14 h-7 shadow-sm peer-checked:bg-gradient-to-r 
        peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-blue-900 
        dark:after:bg-gray-900 after:outline-none after:h-5 after:w-5 after:top-1 after:left-1 
        peer-checked:after:translate-x-7 peer-hover:after:scale-95 relative`}
      >
        <MoonIcon className="absolute top-[4.5px] left-[2.5px] fill-gray-200 w-5 h-5" />
        <SunIcon className="absolute top-[4.5px] right-[2.5px] fill-yellow-700 w-5 h-5" />
      </div>
    </label>
  );
}
