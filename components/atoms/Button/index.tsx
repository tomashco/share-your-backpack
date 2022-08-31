import * as React from 'react';

type Props = {
    text: string
    type: string
    onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void
    className?: string
  }

function getButtonType(buttonType) {
  switch (buttonType) {
    case 'primary': return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg';
    case 'secondary': return 'bg-white hover:bg-blue-300 text-blue font-bold py-2 px-4 rounded-lg';
    case 'link': return 'hover:text-blue-500 font-bold py-2 px-4 rounded-lg';
    default: return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg';
  }
}

function Button({
  text, onSubmit, className, type,
}: Props) {
  return (
    <button type="button" onSubmit={onSubmit} className={`${getButtonType(type)} ${className}`}>
      {text}
    </button>
  );
}

export default Button;
