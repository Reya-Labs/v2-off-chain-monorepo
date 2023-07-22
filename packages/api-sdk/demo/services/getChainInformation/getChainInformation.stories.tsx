import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetChainInformationTest } from './index';
import { GetChainInformationArgs } from '../../../src';

export default {
  title: 'services/getChainInformation',
  component: GetChainInformationTest,
} as ComponentMeta<typeof GetChainInformationTest>;

const Template: ComponentStory<typeof GetChainInformationTest> = (args) => (
  <GetChainInformationTest {...args} />
);

export const Default = Template.bind({});
const args: GetChainInformationArgs = {
  chainIds: [],
};
Default.args = args;
