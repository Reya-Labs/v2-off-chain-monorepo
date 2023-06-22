import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { RolloverWithLpTest } from './index';

export default {
  title: 'services/rolloverWithLp',
  component: RolloverWithLpTest,
} as ComponentMeta<typeof RolloverWithLpTest>;

const Template: ComponentStory<typeof RolloverWithLpTest> = (args) => (
  <RolloverWithLpTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
  maturedPositionId: '',
  fixedLow: 0,
  fixedHigh: 0,
  notional: 0,
  margin: 0,
};
