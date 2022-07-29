import React from 'react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div>
      <h1>
        Welcome to Share Your Backpack!
      </h1>
      <span>
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </span>
    </div>
  );
}
