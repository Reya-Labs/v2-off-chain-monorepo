import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { EditSwapTest } from './index';

export default {
  title: 'services/editSwap',
  component: EditSwapTest,
} as ComponentMeta<typeof EditSwapTest>;

const Template: ComponentStory<typeof EditSwapTest> = (args) => (
  <EditSwapTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  positionId: '',
  notional: 0,
  margin: 0,
};
