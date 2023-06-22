import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { GetBalanceTest } from './index';

export default {
  title: 'services/getBalance',
  component: GetBalanceTest,
} as ComponentMeta<typeof GetBalanceTest>;

const Template: ComponentStory<typeof GetBalanceTest> = (args) => (
  <GetBalanceTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
};
