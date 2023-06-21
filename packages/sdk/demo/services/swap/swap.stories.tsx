import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { SwapTest } from './index';

export default {
  title: 'services/swap',
  component: SwapTest,
} as ComponentMeta<typeof SwapTest>;

const Template: ComponentStory<typeof SwapTest> = (args) => (
  <SwapTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
  notional: 0,
  margin: 0,
};
