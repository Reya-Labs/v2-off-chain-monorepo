import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { RolloverWithSwapTest } from './index';

export default {
  title: 'services/rolloverWithSwap',
  component: RolloverWithSwapTest,
} as ComponentMeta<typeof RolloverWithSwapTest>;

const Template: ComponentStory<typeof RolloverWithSwapTest> = (args) => (
  <RolloverWithSwapTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
  maturedPositionId: '',
  notional: 0,
  margin: 0,
};
