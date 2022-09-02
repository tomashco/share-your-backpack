import React from 'react';
import { Story, Meta } from '@storybook/react';
import GenericLayout, { GenericLayoutProps } from '.';

export default {
  title: 'GenericLayout',
  component: GenericLayout,
} as Meta;

function GenericLayoutStory({ title, children }) {
  return (
    <GenericLayout title={title}>
      {children}
    </GenericLayout>
  );
}

const Template: Story<GenericLayoutProps> = GenericLayoutStory;

export const Default = Template.bind({});
Default.args = {

};
