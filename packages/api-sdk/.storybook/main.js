module.exports = {
  stories: ['../demo/**/**/*.stories.mdx', '../demo/**/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin'
  },
  webpackFinal: async (config) => {
    // Add SVGR Loader
    // ========================================================
    // Remove svg rules from existing webpack rule
    const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));

    const assetLoader = {
      loader: assetRule.loader,
      options: assetRule.options || assetRule.query,
    };

    config.module.rules.unshift({
      test: /\.svg$/,
      use: ['@svgr/webpack', assetLoader],
    });

    return config;
  },
};
