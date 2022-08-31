import { Story, Meta } from '@storybook/react';
import React from 'react';
import FilterItems, { FilterItemsProps } from '.';

export default {
  title: 'FilterItems',
  component: FilterItems,
} as Meta;

function FilterItemsStory(items) { return <FilterItems items={items} />; }

const Template: Story<FilterItemsProps> = FilterItemsStory;

export const Default = Template.bind({});
Default.args = {

};
