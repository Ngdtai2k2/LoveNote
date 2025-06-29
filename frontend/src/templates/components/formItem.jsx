export function FormItem({ label, name, value, onChange, type = 'text', maxLength }) {
  return (
    <div>
      <label className="block mb-1 text-sm">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        className={`w-full ${type === 'color' ? 'cursor-pointer' : 'rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500'}`}
      />
    </div>
  );
}
