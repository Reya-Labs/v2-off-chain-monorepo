import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetLpPositionsByPoolArgs } from '../../../src';
import { GetLpPositionsByPoolTest } from '.';

export default {
  title: 'services/getLpPositionsByPool',
  component: GetLpPositionsByPoolTest,
} as ComponentMeta<typeof GetLpPositionsByPoolTest>;

const Template: ComponentStory<typeof GetLpPositionsByPoolTest> = (args) => (
  <GetLpPositionsByPoolTest {...args} />
);

export const Default = Template.bind({});
const args: GetLpPositionsByPoolArgs = { ownerAddress: '', poolId: '' };
Default.args = args;
