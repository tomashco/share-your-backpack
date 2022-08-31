import * as React from 'react';

export type InputProps = {
  type: string
  inputId?: string
  name?: string
  required?: boolean
  className?: string
  defaultChecked?: boolean
  }

function getStyle(type) {
  switch (type) {
    case 'text': return 'border border-gray-300 rounded-lg py-2 px-4';
    case 'checkbox': return 'w-5 h-5 mr-3 border border-gray-300 rounded-lg py-2 px-4';

    default: return 'border border-gray-300 rounded-lg py-2 px-4';
  }
}

function Input({
  type, inputId, name, required, className, defaultChecked,
}: InputProps) {
  return (
    <input
      className={`${getStyle(type)} ${className}`}
      type={type}
      id={inputId}
      name={name}
      required={required}
      defaultChecked={defaultChecked}
    />
  );
}

export default Input;
