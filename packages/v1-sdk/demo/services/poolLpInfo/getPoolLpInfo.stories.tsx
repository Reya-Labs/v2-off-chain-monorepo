import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { GetPoolLpInfoTest } from './index';

export default {
  title: 'services/getPoolLpInfo',
  component: GetPoolLpInfoTest,
} as ComponentMeta<typeof GetPoolLpInfoTest>;

const Template: ComponentStory<typeof GetPoolLpInfoTest> = (args) => (
  <GetPoolLpInfoTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
  fixedLow: 0,
  fixedHigh: 0,
};
