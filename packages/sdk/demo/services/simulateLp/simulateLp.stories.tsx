import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { SimulateLpTest } from './index';

export default {
  title: 'services/simulateLp',
  component: SimulateLpTest,
} as ComponentMeta<typeof SimulateLpTest>;

const Template: ComponentStory<typeof SimulateLpTest> = (args) => (
  <SimulateLpTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
  fixedLow: 0,
  fixedHigh: 0,
  notional: 0,
  margin: 0,
};
