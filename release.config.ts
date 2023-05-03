type SemanticReleasePluginConfig = [
  string,
  {
    [key: string]: unknown;
  },
];

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
        workspaceRoot: 'packages/*',
        npmPublish: true,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['packages/*/CHANGELOG.md', 'packages/*/package.json'],
        message:
          'chore(release): set ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};

export default config;
