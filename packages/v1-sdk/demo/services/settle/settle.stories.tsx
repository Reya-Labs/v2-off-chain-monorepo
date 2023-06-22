import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { SettleTest } from './index';

export default {
  title: 'services/settle',
  component: SettleTest,
} as ComponentMeta<typeof SettleTest>;

const Template: ComponentStory<typeof SettleTest> = (args) => (
  <SettleTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  positionId: '',
};
