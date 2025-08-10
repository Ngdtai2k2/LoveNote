import React from 'react';

import { ErrorMessage, Field } from 'formik';

export default function FormTextArea({
  name,
  label,
  placeholder,
  errors,
  touched,
  className,
  disabled,
  required,
  value,
  onChange,
  labelColor,
  rows = 4,
}) {
  return (
    <div className="w-full">
      <div className="flex items-start">
        <h6
          className={`${labelColor} placeholder:text-bold text-[16px] leading-normal first-letter:uppercase`}
        >
          {label}
        </h6>
        {required && <h6 className="text-[15px] leading-tight text-red-500">*</h6>}
      </div>
      <Field
        as="textarea"
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`${className} ${errors[name] && touched[name] ? 'border border-red-500' : ''}`}
        autoComplete={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="p-0 pt-1 text-[12px] font-light italic leading-tight text-red-500 first-letter:uppercase"
      />
    </div>
  );
}
