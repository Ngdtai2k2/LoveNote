import { Tooltip } from '@material-tailwind/react';

export function FormRange({ label, name, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div>
      <label className="block mb-1 text-sm text-white">{label}</label>
      <Tooltip content={`${value}${suffix}`} placement="top">
        <input
          name={name}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full accent-pink-500 cursor-pointer"
        />
      </Tooltip>
    </div>
  );
}
