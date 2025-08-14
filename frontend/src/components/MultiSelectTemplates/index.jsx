import React from 'react';

import Select from 'react-select';

export default function MultiSelectTemplates({
  value,
  options,
  onChange,
  error,
  touched,
  placeholder,
  label,
}) {
  const isDark = localStorage.getItem('mode') === 'dark';

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? '#1f2937' : '#fff',
      color: isDark ? '#fff' : '#000',
      borderColor: isDark ? '#374151' : '#d1d5db',
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#fff' : '#000',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDark ? '#374151' : '#e5e7eb',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? '#fff' : '#000',
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '150px',
      overflowY: 'auto',
      backgroundColor: isDark ? '#1f2937' : '#fff',
      color: isDark ? '#fff' : '#000',
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? (isDark ? '#374151' : '#f3f4f6') : 'transparent',
      color: isDark ? '#fff' : '#000',
      cursor: 'pointer',
    }),
  };

  return (
    <div className="w-full">
      {label && <label className="text-[16px] leading-normal">{label}</label>}
      <Select
        isMulti
        options={options}
        value={options.filter((opt) =>
          Array.isArray(value) ? value.includes(opt.value) : value === '*' && opt.value === '*'
        )}
        onChange={(selected) => {
          if (selected.some((opt) => opt.value === '*')) {
            onChange('*');
          } else {
            onChange(selected.map((opt) => opt.value));
          }
        }}
        classNamePrefix="select"
        placeholder={placeholder}
        styles={customStyles}
      />
      {error && touched && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
