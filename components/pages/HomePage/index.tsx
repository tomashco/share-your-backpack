import React from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button';
import backpackGiphy from '../../../public/images/backpackGiphy.gif';

export default function HomePage() {
  return (
    <div>
      <h1>
        Welcome to Share Your Backpack!
      </h1>
      <p>
        The idea of this project is to build a funnel that helps
        to define what to put into the backpack for your next hyke, AND share it with the community
      </p>
      <div className="flex flex-col items-center">
        <Button text="Add New Backpack" type="link" linkHref="/add-new-backpack" />
        <Image src={backpackGiphy} alt="backpack Giphy" height={300} width={300} />

      </div>
    </div>
  );
}
