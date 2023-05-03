// Define a custom type for plugin configurations
type SemanticReleasePluginConfig = [string, Record<string, unknown>];

interface SemanticReleaseConfiguration {
  branches: string[];
  plugins: (string | SemanticReleasePluginConfig)[];
}

const config: SemanticReleaseConfiguration = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): set ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};

export default config;
