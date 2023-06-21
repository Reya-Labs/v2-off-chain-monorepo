import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { GetPoolSwapInfoTest } from './index';

export default {
  title: 'services/getPoolSwapInfo',
  component: GetPoolSwapInfoTest,
} as ComponentMeta<typeof GetPoolSwapInfoTest>;

const Template: ComponentStory<typeof GetPoolSwapInfoTest> = (args) => (
  <GetPoolSwapInfoTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  positionId: '',
  notional: 0,
  margin: 0,
};
