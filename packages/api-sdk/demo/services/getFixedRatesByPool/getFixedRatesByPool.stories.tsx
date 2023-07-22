import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetFixedRatesByPoolTest } from './index';
import { GetFixedRatesByPoolArgs } from '../../../src';

export default {
  title: 'services/getFixedRatesByPool',
  component: GetFixedRatesByPoolTest,
} as ComponentMeta<typeof GetFixedRatesByPoolTest>;

const Template: ComponentStory<typeof GetFixedRatesByPoolTest> = (args) => (
  <GetFixedRatesByPoolTest {...args} />
);

export const Default = Template.bind({});
const args: GetFixedRatesByPoolArgs = {
  poolId: '',
  startTimestamp: 0,
  endTimestamp: 0,
};
Default.args = args;
