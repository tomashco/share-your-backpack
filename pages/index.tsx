import React from 'react';

import GenericLayout from '../components/templates/GenericLayout';
import HomePage from '../components/pages/HomePage';
// import AddNewBackpack from '../components/pages/AddNewBackpack';

// <h1>Share Your Backpack 🎒</h1>
//       <AddNewBackpack />

function IndexPage() {
  return (
    <GenericLayout title="Home | Share Your backpack">
      <HomePage />
    </GenericLayout>
  );
}

export default IndexPage;
