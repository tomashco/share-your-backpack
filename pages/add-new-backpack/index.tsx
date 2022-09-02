import React from 'react';

import GenericLayout from '../../components/templates/GenericLayout';
import AddNewBackpack from '../../components/pages/AddNewBackpack';

function IndexPage() {
  return (
    <GenericLayout title="Home | Share Your backpack">
      <h1>Add a new Backpack 🎒</h1>
      <AddNewBackpack />
    </GenericLayout>
  );
}

export default IndexPage;
