import * as React from 'react';

type Props = {
    text: string
    onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void
  }

function Button({ text, onSubmit }: Props) {
  return (
    <button type="button" onSubmit={onSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {text}
    </button>
  );
}

export default Button;
