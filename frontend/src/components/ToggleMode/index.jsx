import React from 'react';

import { useInterfaceMode } from '@contexts/interfaceMode/useInterfaceMode';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function ToggleMode() {
  const { mode, toggleMode } = useInterfaceMode();
  const isDark = mode === 'dark';

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        className="peer hidden border-none"
        type="checkbox"
        checked={isDark}
        onChange={toggleMode}
      />
      <div
        className={`group peer relative h-7 w-14 rounded-full border-gray-800 
        bg-gray-300 shadow-sm outline-none ring-0 duration-700 after:absolute after:left-1 
        after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-gray-800 
        after:outline-none after:duration-200 after:content-[''] peer-checked:bg-gradient-to-r peer-checked:after:translate-x-7 peer-hover:after:scale-95 
        peer-focus:outline-none dark:bg-gray-500 dark:after:bg-gray-900`}
      >
        <MoonIcon className="absolute left-[2.5px] top-[4.5px] h-5 w-5 fill-gray-200" />
        <SunIcon className="absolute right-[2.5px] top-[4.5px] h-5 w-5 fill-yellow-700" />
      </div>
    </label>
  );
}
