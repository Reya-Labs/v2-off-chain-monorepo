import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { GetAvailableNotionalTest } from './index';
import { GetAvailableNotionalArgs } from '../../../src';

export default {
  title: 'services/getAvailableNotional',
  component: GetAvailableNotionalTest,
} as ComponentMeta<typeof GetAvailableNotionalTest>;

const Template: ComponentStory<typeof GetAvailableNotionalTest> = (args) => (
  <GetAvailableNotionalTest {...args} />
);

export const Default = Template.bind({});
const args: GetAvailableNotionalArgs = {
  poolId: '',
};
Default.args = args;
