import React from 'react';

export default function FormSelect({
  name,
  label,
  value,
  onChange,
  options = [],
  errors,
  touched,
  required = false,
  className = '',
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="text-[16px] leading-normal">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white ${className}`}
        required={required}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors?.[name] && touched?.[name] && (
        <div className="text-red-500 text-sm">{errors[name]}</div>
      )}
    </div>
  );
}
