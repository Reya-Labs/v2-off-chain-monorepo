import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetMarginAccountPositionsArgs } from '../../../src';
import { GetMarginAccountPositionsTest } from '.';

export default {
  title: 'services/getMarginAccountPositions',
  component: GetMarginAccountPositionsTest,
} as ComponentMeta<typeof GetMarginAccountPositionsTest>;

const Template: ComponentStory<typeof GetMarginAccountPositionsTest> = (
  args,
) => <GetMarginAccountPositionsTest {...args} />;

export const Default = Template.bind({});
const args: GetMarginAccountPositionsArgs = {
  id: '',
};
Default.args = args;
