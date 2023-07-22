import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetVariableRatesByPoolTest } from './index';
import { GetVariableRatesByPoolArgs } from '../../../src';

export default {
  title: 'services/getVariableRatesByPool',
  component: GetVariableRatesByPoolTest,
} as ComponentMeta<typeof GetVariableRatesByPoolTest>;

const Template: ComponentStory<typeof GetVariableRatesByPoolTest> = (args) => (
  <GetVariableRatesByPoolTest {...args} />
);

export const Default = Template.bind({});
const args: GetVariableRatesByPoolArgs = {
  endTimestamp: 0,
  poolId: '',
  startTimestamp: 0,
};
Default.args = args;
