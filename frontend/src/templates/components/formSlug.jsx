import { useEffect, useRef, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { userSiteAPI } from '@api/userSite';

export default function FormSlug({ name = 'slug', label = 'Slug' }) {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [slug, setSlug] = useState(field.value || '');
  const [exists, setExists] = useState(false);
  const debounceTimeout = useRef(null);

  const { t } = useTranslation('template');

  useEffect(() => {
    if (!slug) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const res = await userSiteAPI.checkSlugExists?.(slug);
      setExists(res);
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [slug]);

  const handleChange = (e) => {
    const newSlug = e.target.value;
    setSlug(newSlug);
    setFieldValue(name, newSlug);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={slug}
        onChange={handleChange}
        placeholder={`${import.meta.env.VITE_CLIENT_URL}/`}
        className={`${exists ? `border-red-500 bottom-1 text-red-500` : `text-gray-900`} border rounded 
        px-2 py-1 text-sm outline-none`}
      />
      {exists && <span className="text-red-500 text-sm">{t('slug_exists')}</span>}

      {slug && (
        <span className="text-sm text-gray-300">{`${import.meta.env.VITE_CLIENT_URL}/${slug}`}</span>
      )}
    </div>
  );
}
