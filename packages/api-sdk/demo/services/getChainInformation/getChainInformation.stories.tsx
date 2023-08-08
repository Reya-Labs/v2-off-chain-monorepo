import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { GetChainInformationArgs } from '../../../src';
import { GetChainInformationTest } from '.';

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
