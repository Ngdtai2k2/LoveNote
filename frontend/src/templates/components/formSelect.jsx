export function FormSelect({ label, name, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block mb-1 text-sm">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-gray-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white/10 text-gray-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
