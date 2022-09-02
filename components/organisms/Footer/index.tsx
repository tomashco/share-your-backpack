import * as React from 'react';
import Image from 'next/image';
import tomashcoLogo from '../../../public/images/tomashcoLogo.png';

function Footer() {
  return (
    <footer className="flex flex-col items-center flex-0 h-30 w-screen">
      <h6>
        powered by
      </h6>
      <div className="w-52 ">
        <Image src={tomashcoLogo} layout="responsive" />
      </div>
    </footer>
  );
}

export default Footer;
