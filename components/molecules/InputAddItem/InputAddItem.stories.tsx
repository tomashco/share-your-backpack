import { Story, Meta } from '@storybook/react';
import React from 'react';
import InputAddItem, { InputAddItemProps } from '.';

export default {
  title: 'InputAddItem',
  component: InputAddItem,
} as Meta;

function InputAddItemStory({ inputId, buttonText }:InputAddItemProps) {
  return (
    <InputAddItem
      inputId={inputId}
      buttonText={buttonText}
    />
  );
}
const Template: Story<InputAddItemProps> = InputAddItemStory;

export const Default = Template.bind({});
Default.args = {

};
