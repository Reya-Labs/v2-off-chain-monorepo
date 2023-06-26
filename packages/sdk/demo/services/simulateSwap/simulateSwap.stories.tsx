import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { SimulateSwapTest } from './index';

export default {
  title: 'services/simulateSwap',
  component: SimulateSwapTest,
} as ComponentMeta<typeof SimulateSwapTest>;

const Template: ComponentStory<typeof SimulateSwapTest> = (args) => (
  <SimulateSwapTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
  notional: 0,
  margin: 0,
};
