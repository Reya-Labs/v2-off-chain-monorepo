import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { ApprovePeripheryTest } from './index';

export default {
  title: 'services/approvePeriphery',
  component: ApprovePeripheryTest,
} as ComponentMeta<typeof ApprovePeripheryTest>;

const Template: ComponentStory<typeof ApprovePeripheryTest> = (args) => (
  <ApprovePeripheryTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
};
