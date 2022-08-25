import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Props = {
  children?: ReactNode
  title?: string
}

function Layout({ children, title = 'This is the default title' }: Props) {
  return (

    <div className="flex flex-col min-h-screen bg-red-300 items-center">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="flex flex-col flex-0 h-24 w-screen flex items-center">
        <nav>
          <Link href="/" passHref>
            <a href="home">Home</a>
          </Link>
          {' '}
          |
          {' '}
          <Link href="/about" passHref>
            <a href="about">About</a>
          </Link>
          {' '}
          |
          {' '}
          <Link href="/users" passHref>
            <a href="users">Users List</a>
          </Link>
          {' '}
          |
          {' '}
          <Link href="/api/users">Users API</Link>
        </nav>
      </header>
      <div className="flex flex-col flex-1 prose">
        {children}
      </div>
      <footer className="flex flex-col flex-0 h-24 w-screen">
        <hr />
        <span>I&apos;m here to stay (Footer)</span>
      </footer>
    </div>
  );
}

export default Layout;
