import React, { useState } from 'react';
import { IconButton, Tooltip } from '@material-tailwind/react';
import { Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ROUTES from '@constants/routes';

export default function MenuSettings({ settings, onUpdate }) {
  const { t } = useTranslation('template');
  const navigate = useNavigate();

  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpenSettings(true)}
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20"
        ripple={false}
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </IconButton>

      <IconButton
        onClick={() => navigate(ROUTES.HOME)}
        className="absolute top-4 left-4 z-20 bg-white/10 hover:bg-white/20"
        ripple={false}
      >
        <HomeIcon className="h-6 w-6 text-white" />
      </IconButton>

      {openSettings && (
        <div className="fixed right-0 top-0 z-30 h-full w-[350px] bg-black bg-opacity-90 text-white shadow-lg border-l border-white/20 transition-all overflow-scroll">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold">{t('settings')}</h2>
            <button
              onClick={() => setOpenSettings(false)}
              className="text-white hover:text-pink-300"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-4">
            {/* text value */}
            <div>
              <label className="block mb-1 text-sm">{t('text_rain')}</label>
              <input
                className="w-full rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500"
                value={settings.textRain}
                maxLength={20}
                onChange={(e) => onUpdate('textRain', e.target.value)}
              />
            </div>
            {/* font size */}
            <div>
              <label className="block mb-1 text-sm">{t('font_size_text_rain')}</label>
              <Tooltip content={`Font Size: ${settings.fontSize}`} placement="top">
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={settings.fontSize}
                  onChange={(e) => onUpdate('fontSize', Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Tooltip>
            </div>
            {/* color */}
            <div>
              <label className="block mb-1 text-sm">{t('text_color')}</label>
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => onUpdate('textColor', e.target.value)}
                className="w-full cursor-pointer"
              />
            </div>
            {/* title */}
            <div>
              <label className="block mb-1 text-sm">{t('title')}</label>
              <input
                className="w-full rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500"
                value={settings.title}
                maxLength={20}
                onChange={(e) => onUpdate('title', e.target.value)}
              />
            </div>
            {/* title color */}
            <div>
              <label className="block mb-1 text-sm">{t('title_color')}</label>
              <input
                type="color"
                value={settings.titleColor}
                onChange={(e) => onUpdate('titleColor', e.target.value)}
                className="w-full cursor-pointer"
              />
            </div>
            {/* font size title */}
            <div>
              <label className="block text-sm text-white mt-4">{t('font_size_title')}</label>
              <Tooltip content={`Font Size: ${settings.fontSizeTitle}`} placement="top">
                <input
                  type="range"
                  min="16"
                  max="200"
                  step="1"
                  value={settings.fontSizeTitle}
                  onChange={(e) => onUpdate('fontSizeTitle', parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Tooltip>
            </div>

            {/* Opacity */}
            <div>
              <label className="block mb-1 text-sm">{t('color_spread')}</label>
              <Tooltip content={`${Math.round(settings.backgroundOpacity * 100)}%`} placement="top">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={settings.backgroundOpacity}
                  onChange={(e) => onUpdate('backgroundOpacity', parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Tooltip>
            </div>
            {/* Background color */}
            <div>
              <label className="block mb-1 text-sm">{t('background_color')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundHex}
                  onChange={(e) => onUpdate('backgroundHex', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
            {/* speed */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">{t('rain_speed')}</label>
              <Tooltip content={settings.rainSpeed} placement="top">
                <input
                  type="range"
                  min="0.2"
                  max="5"
                  step="0.1"
                  value={settings.rainSpeed}
                  onChange={(e) => onUpdate('rainSpeed', parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Tooltip>
            </div>
            {/* text per click */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                {t('text_per_click')}
              </label>
              <Tooltip content={settings.textPerClick} placement="top">
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={settings.textPerClick}
                  onChange={(e) => onUpdate('textPerClick', parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Tooltip>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-white mt-4">
                <input
                  type="checkbox"
                  checked={settings.autoBurst}
                  onChange={(e) => onUpdate('autoBurst', e.target.checked)}
                  className="accent-pink-500 cursor-pointer w-4 h-4"
                />
                {t('auto_random_click')}
              </label>
            </div>
            {/* Toggle music */}
            <div>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={settings.playAudio}
                  onChange={(e) => onUpdate('playAudio', e.target.checked)}
                  className="accent-pink-500 cursor-pointer w-4 h-4"
                />
                {t('background_sound')}
              </label>
            </div>
            {/* Volume */}
            <div>
              <label className="block mt-2 text-sm text-white">{t('volume')}</label>
              <Tooltip content={`${Math.round(settings.audioVolume * 100)}%`} placement="top">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.audioVolume}
                  onChange={(e) => onUpdate('audioVolume', parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Tooltip>
            </div>

            {/* Upload file */}
            <div>
              <label className="block mt-2 text-sm text-white">{t('upload')}</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const audioURL = URL.createObjectURL(file);
                    onUpdate('audioFile', audioURL);
                    onUpdate('playAudio', true);
                  }
                }}
                className="mt-1 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
