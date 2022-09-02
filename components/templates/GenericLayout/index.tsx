import React, { ReactNode } from 'react';
import Head from 'next/head';
import HeaderMenu from '../../molecules/HeaderMenu';
import Footer from '../../organisms/Footer';

export type GenericLayoutProps = {
  children?: ReactNode
  title?: string
}

function GenericLayout({ children, title }: GenericLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-red-300 items-center">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HeaderMenu />
      <div className="flex flex-col flex-1 prose">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default GenericLayout;
