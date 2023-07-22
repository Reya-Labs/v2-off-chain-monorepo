import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetLpPositionsByPoolTest } from './index';
import { GetLpPositionsByPoolArgs } from '../../../src';

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
