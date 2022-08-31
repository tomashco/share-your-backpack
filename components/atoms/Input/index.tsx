import * as React from 'react';

export type InputProps = {
  type: string
  inputId: string
  name: string
  required: boolean
  }

function Input({
  type, inputId, name, required,
}: InputProps) {
  return (
    <input
      className="border border-gray-300 rounded-lg py-2 px-4"
      type={type}
      id={inputId}
      name={name}
      required={required}
    />
  );
}

export default Input;
