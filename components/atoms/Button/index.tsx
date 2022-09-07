import * as React from 'react';
import Link from 'next/link';

type Props = {
    text: string
    type: string
    onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void
    className?: string
    linkHref?: string
  }

function getButtonType(buttonType) {
  switch (buttonType) {
    case 'cta': return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full';
    case 'primary': return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg';
    case 'secondary': return 'bg-white hover:bg-blue-300 text-blue font-bold py-2 px-4 rounded-lg';
    case 'link': return 'hover:text-blue-500 font-bold py-2 px-4 rounded-lg';
    default: return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg';
  }
}

function Button({
  text, onSubmit, className, type, linkHref,
}: Props) {
  return (
    <button type="button" onSubmit={onSubmit} className={`${getButtonType(type)} ${className}`}>
      {linkHref
        ? (
          <Link href={linkHref} passHref>
            <a href={linkHref}>{text}</a>
          </Link>
        )
        : text }
    </button>
  );
}

export default Button;
