import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetPoolsArgs } from '../../../src';
import { GetPoolsTest } from '.';

export default {
  title: 'services/getPools',
  component: GetPoolsTest,
} as ComponentMeta<typeof GetPoolsTest>;

const Template: ComponentStory<typeof GetPoolsTest> = (args) => (
  <GetPoolsTest {...args} />
);

export const Default = Template.bind({});
const args: GetPoolsArgs = {
  chainIds: [],
};
Default.args = args;
