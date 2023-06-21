import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { EditLpTest } from './index';

export default {
  title: 'services/editLp',
  component: EditLpTest,
} as ComponentMeta<typeof EditLpTest>;

const Template: ComponentStory<typeof EditLpTest> = (args) => (
  <EditLpTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  positionId: '',
  notional: 0,
  margin: 0,
};
