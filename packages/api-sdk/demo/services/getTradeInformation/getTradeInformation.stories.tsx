import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetTradeInformationTest } from './index';
import { GetTradeInformationArgs } from '../../../src';

export default {
  title: 'services/getTradeInformation',
  component: GetTradeInformationTest,
} as ComponentMeta<typeof GetTradeInformationTest>;

const Template: ComponentStory<typeof GetTradeInformationTest> = (args) => (
  <GetTradeInformationTest {...args} />
);

export const Default = Template.bind({});
const args: GetTradeInformationArgs = { base: 0, poolId: '' };
Default.args = args;
