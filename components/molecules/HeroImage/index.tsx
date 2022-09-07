import { url } from 'inspector';
import * as React from 'react';
import Button from '../../atoms/Button';

export type HeroImageProps = {
  id: string
  title: string
  imgPath: string
  description: string
  ctaText: string
  ctaHref: string

  }

function HeroImage({
  id, title, imgPath, description, ctaText, ctaHref,
}: HeroImageProps) {
  return (
    <div id={id} className="bg-cover flex flex-col justify-center items-center w-screen h-screen" style={{ backgroundImage: `url(${imgPath})` }}>
      <h1 className="font-bold text-6xl text-white drop-shadow-2xl">{title}</h1>
      <p className="mt-7 font-bold text-lg text-white drop-shadow-lg">{description}</p>
      <Button className="mt-7 drop-shadow-lg" text={ctaText} type="cta" linkHref={ctaHref} />
    </div>
  );
}

export default HeroImage;
