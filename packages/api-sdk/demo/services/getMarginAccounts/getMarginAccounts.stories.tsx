import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetMarginAccountsArgs } from '../../../src';
import { GetMarginAccountsTest } from '.';

export default {
  title: 'services/getMarginAccounts',
  component: GetMarginAccountsTest,
} as ComponentMeta<typeof GetMarginAccountsTest>;

const Template: ComponentStory<typeof GetMarginAccountsTest> = (args) => (
  <GetMarginAccountsTest {...args} />
);

export const Default = Template.bind({});
const args: GetMarginAccountsArgs = {
  chainIds: [],
  ownerAddress: '',
  sort: {
    id: 'balance',
    direction: 'descending',
  },
  page: 1,
  perPage: 10,
};
Default.args = args;
