import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetPoolArgs } from '../../../src';
import { GetPoolTest } from '.';

export default {
  title: 'services/getPool',
  component: GetPoolTest,
} as ComponentMeta<typeof GetPoolTest>;

const Template: ComponentStory<typeof GetPoolTest> = (args) => (
  <GetPoolTest {...args} />
);

export const Default = Template.bind({});
const args: GetPoolArgs = { poolId: '' };
Default.args = args;
