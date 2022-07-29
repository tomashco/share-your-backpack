import React from 'react';

import Link from 'next/link';
import Layout from '../components/Layout';

function IndexPage() {
  return (
    <Layout title="Home | Share Your backpack">
      <h1>Share Your Backpack 🎒</h1>
      <p>
        <Link href="/about" passHref>
          <a href="about">About</a>
        </Link>
      </p>
    </Layout>
  );
}

export default IndexPage;
