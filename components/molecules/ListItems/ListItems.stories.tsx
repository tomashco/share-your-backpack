import { Story, Meta } from '@storybook/react';
import React from 'react';
import ListItems, { ListItemsProps } from '.';

export default {
  title: 'ListItems',
  component: ListItems,
} as Meta;

function ListItemsStory({ items }) { return <ListItems items={items} />; }

const Template: Story<ListItemsProps> = ListItemsStory;

export const Default = Template.bind({});
Default.args = {

};
