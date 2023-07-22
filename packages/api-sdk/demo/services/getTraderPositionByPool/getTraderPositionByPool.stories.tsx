import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetTraderPositionByPoolTest } from './index';
import { GetTraderPositionByPoolArgs } from '../../../src';

export default {
  title: 'services/getTraderPositionByPool',
  component: GetTraderPositionByPoolTest,
} as ComponentMeta<typeof GetTraderPositionByPoolTest>;

const Template: ComponentStory<typeof GetTraderPositionByPoolTest> = (args) => (
  <GetTraderPositionByPoolTest {...args} />
);

export const Default = Template.bind({});
const args: GetTraderPositionByPoolArgs = { ownerAddress: '', poolId: '' };
Default.args = args;
