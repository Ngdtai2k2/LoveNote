export function FormArea({ label, type = 'text', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm">
          {label}
        </label>
      )}
      <textarea
        className={`w-full ${
          type === 'color'
            ? 'cursor-pointer'
            : 'rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500'
        }`}
        {...props}
      />
    </div>
  );
}
