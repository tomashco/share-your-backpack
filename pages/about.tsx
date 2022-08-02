import React from 'react';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';

function AboutPage(props) {
  const { content } = props;

  return (
    <Layout title="About | Next.js + TypeScript Example">

      <h1>About</h1>
      <ReactMarkdown>{content.default}</ReactMarkdown>

      <p>
        <Link href="/" passHref>
          <a href="home">Go home</a>
        </Link>
      </p>
    </Layout>
  );
}

AboutPage.getInitialProps = async () => {
  // eslint-disable-next-line global-require
  const content = await require('../README.md');
  return { content };
};

export default AboutPage;
