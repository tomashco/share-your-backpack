import React from 'react';
import { Story, Meta } from '@storybook/react';
import Footer from '.';

export default {
  title: 'Footer',
  component: Footer,
} as Meta;

function FooterStory() { return <Footer />; }

const Template: Story = FooterStory;

export const Default = Template.bind({});
Default.args = {

};
