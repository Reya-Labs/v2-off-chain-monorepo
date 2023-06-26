import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { SimulateEditLpTest } from './index';

export default {
  title: 'services/simulateEditLp',
  component: SimulateEditLpTest,
} as ComponentMeta<typeof SimulateEditLpTest>;

const Template: ComponentStory<typeof SimulateEditLpTest> = (args) => (
  <SimulateEditLpTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  positionId: '',
  notional: 0,
  margin: 0,
};
