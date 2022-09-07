import React from 'react';
import GenericLayout from '../components/templates/GenericLayout';
import HeroImage from '../components/molecules/HeroImage';
import AddNewBackpack from '../components/pages/AddNewBackpack';

function IndexPage() {
  return (
    <div>
      <HeroImage
        id="head"
        title="Share Your Backpack"
        imgPath="/images/backpackBackground.png"
        description="A utility to showcase your best gear during the trails"
        ctaText="Hike Now"
        ctaHref="#start-funnel"
      />
      <GenericLayout title="Home | Share Your backpack">
        <div id="start-funnel">
          <AddNewBackpack />
        </div>
      </GenericLayout>
    </div>
  );
}

export default IndexPage;
