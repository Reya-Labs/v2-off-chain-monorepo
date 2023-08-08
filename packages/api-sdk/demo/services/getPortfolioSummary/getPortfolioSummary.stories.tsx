import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetPortfolioSummaryArgs } from '../../../src';
import { GetPortfolioSummaryTest } from '.';

export default {
  title: 'services/getPortfolioSummary',
  component: GetPortfolioSummaryTest,
} as ComponentMeta<typeof GetPortfolioSummaryTest>;

const Template: ComponentStory<typeof GetPortfolioSummaryTest> = (args) => (
  <GetPortfolioSummaryTest {...args} />
);

export const Default = Template.bind({});
const args: GetPortfolioSummaryArgs = {
  chainIds: [],
  ownerAddress: '',
};
Default.args = args;
