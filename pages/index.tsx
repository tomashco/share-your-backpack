import React from 'react';

import Layout from '../components/Layout';
import AddNewBackpack from '../components/AddNewBackpack';

function IndexPage() {
  return (
    <Layout title="Home | Share Your backpack">
      <h1>Share Your Backpack 🎒</h1>
      <AddNewBackpack />
    </Layout>
  );
}

export default IndexPage;
