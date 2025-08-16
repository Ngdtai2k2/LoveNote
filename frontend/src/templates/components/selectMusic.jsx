import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { musicAPI } from '@api/music';

let cachedMusics = null;

export default function SelectMusic({ value, onChange, onUpdate, required }) {
  const [musics, setMusics] = useState(cachedMusics || []);
  const [loading, setLoading] = useState(!cachedMusics);
  const [touched, setTouched] = useState(false);

  const { t } = useTranslation('template');

  useEffect(() => {
    if (cachedMusics) return;

    setLoading(true);
    musicAPI
      .getAll()
      .then((data) => {
        cachedMusics = data;
        setMusics(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const showError = required && touched && !value;

  const handleSelect = (id) => {
    onChange(Number(id));

    if (onUpdate) {
      const music = musics.find((m) => m.id === Number(id));
      if (music) {
        onUpdate(`${import.meta.env.VITE_SERVER_URL}${music.url}`);
      } else {
        onUpdate(null);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-white">{t('choose_music')}</label>
      <select
        className={`p-2 rounded bg-white text-black border ${
          showError ? 'border-red-500' : 'border-gray-600'
        }`}
        value={value || ''}
        onChange={(e) => handleSelect(e.target.value)}
        onBlur={() => setTouched(true)}
        disabled={loading}
      >
        {/* <option value="">{t('no_choose')}</option> */}
        {musics.map((music) => (
          <option key={music.id} value={music.id}>
            {music.title} {music.artist ? `- ${music.artist}` : ''}
          </option>
        ))}
      </select>
      {showError && <p className="text-red-500 text-sm">{t('pls_choose_music')}</p>}
    </div>
  );
}
