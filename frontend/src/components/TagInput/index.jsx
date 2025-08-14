import React, { useState } from 'react';

export default function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && input === '') {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-1 border p-2 rounded min-h-[40px] dark:bg-gray-700">
      {value.map((val, i) => (
        <span
          key={i}
          className="bg-gray-200 text-gray-800 px-2 py-1 rounded flex items-center gap-1"
        >
          {val}
          <button type="button" onClick={() => removeTag(i)} className="font-bold text-red-500">
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 outline-none min-w-[100px] dark:bg-gray-700 dark:text-gray-200"
      />
    </div>
  );
}
