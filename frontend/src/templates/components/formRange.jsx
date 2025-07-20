import { Tooltip } from '@material-tailwind/react';

export default function FormRange({ label, name, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div>
      <label className="block mb-1 text-sm text-white">{label}</label>
      <Tooltip
        content={`${suffix === '%' ? Math.round(value * 100) : value}${suffix}`}
        placement="top"
      >
        <input
          name={name}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full accent-gray-500 cursor-pointer"
        />
      </Tooltip>
    </div>
  );
}
