import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';

function AboutPage() {
  const [content, setContent] = useState('');
  useEffect(() => {
    fetch('./README.md')
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <Layout title="About | Next.js + TypeScript Example">
      <h1>About</h1>
      <ReactMarkdown>{content}</ReactMarkdown>
      <p>
        <Link href="/" passHref>
          <a href="home">Go home</a>
        </Link>
      </p>
    </Layout>
  );
}

export default AboutPage;
