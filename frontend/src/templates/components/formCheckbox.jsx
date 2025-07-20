export default function FormCheckbox({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-white mt-2">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-gray-500 cursor-pointer w-4 h-4"
      />
      {label}
    </label>
  );
}
