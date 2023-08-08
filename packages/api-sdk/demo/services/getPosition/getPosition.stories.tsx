import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetPositionArgs } from '../../../src';
import { GetPositionTest } from '.';

export default {
  title: 'services/getPosition',
  component: GetPositionTest,
} as ComponentMeta<typeof GetPositionTest>;

const Template: ComponentStory<typeof GetPositionTest> = (args) => (
  <GetPositionTest {...args} />
);

export const Default = Template.bind({});
const args: GetPositionArgs = {
  positionId: '',
  includeHistory: false,
};
Default.args = args;
