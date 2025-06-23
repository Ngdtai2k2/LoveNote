import React from "react";
import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";

export default function FormField({
  name,
  label,
  type,
  placeholder,
  errors,
  touched,
  className,
  disabled,
  required,
  value,
  onChange,
  labelColor,
}) {
  return (
    <div className="w-full">
      <div className="flex items-start">
        <h6
          className={`${labelColor} placeholder:text-bold text-[16px] leading-normal first-letter:uppercase`}
        >
          {label}
        </h6>
        {required && (
          <h6 className="text-[15px] leading-tight text-red-500">*</h6>
        )}
      </div>
      <Field
        as="input"
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${className} ${errors[name] && touched[name] ? "border border-red-500" : ""}`}
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

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  errors: PropTypes.object,
  touched: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  labelColor: PropTypes.string,
};
