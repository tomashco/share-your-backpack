import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Props = {
  children?: ReactNode
  title?: string
}

function Layout({ children, title = 'This is the default title' }: Props) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
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
      {children}
      <footer>
        <hr />
        <span>I&apos;m here to stay (Footer)</span>
      </footer>
    </div>
  );
}

export default Layout;
