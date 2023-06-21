import React from 'react';
import { addDecorator } from '@storybook/react';
import darkTheme from './themes/dark';
import { Page } from 'brokoli-ui';
import { WalletContextProvider } from '../demo/context/WalletContext';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
  docs: {
    theme: darkTheme,
  },
};

addDecorator((story, storyInfo) => {
  return (
    <WalletContextProvider>
      <Page>{story()}</Page>
    </WalletContextProvider>
  );
});
