import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { UpdateMarginTest } from './index';

export default {
  title: 'services/updateMargin',
  component: UpdateMarginTest,
} as ComponentMeta<typeof UpdateMarginTest>;

const Template: ComponentStory<typeof UpdateMarginTest> = (args) => (
  <UpdateMarginTest {...args} />
);

export const Default = Template.bind({});
Default.args = {
  positionId: '',
  margin: 0,
};
