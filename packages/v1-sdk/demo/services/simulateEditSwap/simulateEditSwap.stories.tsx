import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { SimulateEditSwapTest } from './index';

export default {
  title: 'services/simulateEditSwap',
  component: SimulateEditSwapTest,
} as ComponentMeta<typeof SimulateEditSwapTest>;

const Template: ComponentStory<typeof SimulateEditSwapTest> = (args) => (
  <SimulateEditSwapTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  positionId: '',
  notional: 0,
  margin: 0,
};
