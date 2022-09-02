import HeaderMenu, { HeaderMenuProps } from '.'
import React from 'react';
import { Story, Meta } from '@storybook/react'

export default {
  title: 'HeaderMenu',
  component: HeaderMenu,
} as Meta

function HeaderMenuStory(prop) { return <HeaderMenu prop={prop} />}

const Template: Story<HeaderMenuProps> = HeaderMenuStory


export const Default = Template.bind({})
Default.args = {

}
