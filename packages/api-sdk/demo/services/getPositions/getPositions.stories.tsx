import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetPositionsArgs } from '../../../src';
import { GetPositionsTest } from '.';

export default {
  title: 'services/getPositions',
  component: GetPositionsTest,
} as ComponentMeta<typeof GetPositionsTest>;

const Template: ComponentStory<typeof GetPositionsTest> = (args) => (
  <GetPositionsTest {...args} />
);

export const Default = Template.bind({});
const args: GetPositionsArgs = {
  ownerAddress: '',
  chainIds: [],
};
Default.args = args;
