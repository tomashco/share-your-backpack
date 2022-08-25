import { Story, Meta } from '@storybook/react';
import * as React from 'react';
import Input, { InputProps } from '.';

export default {
  title: 'Input',
  component: Input,
} as Meta;

const Template: Story<InputProps> = function InputStory(prop) { return <Input prop={prop} />; };

export const Default = Template.bind({});
Default.args = {

};
