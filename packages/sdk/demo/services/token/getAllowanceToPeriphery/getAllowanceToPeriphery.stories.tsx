import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { GetAllowanceToPeripheryTest } from './index';

export default {
  title: 'services/getAllowanceToPeriphery',
  component: GetAllowanceToPeripheryTest,
} as ComponentMeta<typeof GetAllowanceToPeripheryTest>;

const Template: ComponentStory<typeof GetAllowanceToPeripheryTest> = (args) => (
  <GetAllowanceToPeripheryTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ammId: '',
};
