import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetTraderPositionByPoolArgs } from '../../../src';
import { GetTraderPositionByPoolTest } from '.';

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
