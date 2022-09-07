import Title, { TitleProps } from '.'
import React from 'react';
import { Story, Meta } from '@storybook/react'

export default {
  title: 'Title',
  component: Title,
} as Meta

function TitleStory(prop) { return <Title prop={prop} />}

const Template: Story<TitleProps> = TitleStory


export const Default = Template.bind({})
Default.args = {

}
