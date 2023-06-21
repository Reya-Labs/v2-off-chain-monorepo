import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { LpTest } from './index';

export default {
  title: 'services/lp',
  component: LpTest,
} as ComponentMeta<typeof LpTest>;

const Template: ComponentStory<typeof LpTest> = (args) => <LpTest {...args} />;

export const Default = Template.bind({});
Default.args = {
  ammId: '',
  fixedLow: 0,
  fixedHigh: 0,
  notional: 0,
  margin: 0,
};
