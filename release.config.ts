import { Options as CommitAnalyzerOptions } from '@semantic-release/commit-analyzer';
import { Options as ReleaseNotesGeneratorOptions } from '@semantic-release/release-notes-generator';
import { Options as ChangelogOptions } from '@semantic-release/changelog';
import { Options as NpmOptions } from '@semantic-release/npm';
import { Options as GithubOptions } from '@semantic-release/github';
import { Options as GitOptions } from '@semantic-release/git';

const pkgRoot = process.env.PKG_ROOT || '.';
console.log(`pkgRoot is ${pkgRoot}`);

type PluginConfig =
  | string
  | [string, CommitAnalyzerOptions]
  | [string, ReleaseNotesGeneratorOptions]
  | [string, ChangelogOptions]
  | [string, NpmOptions]
  | [string, GithubOptions]
  | [string, GitOptions];

const config: { [key: string]: any } = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tarballDir: 'dist',
        publishConfig: {
          registry: 'https://npm.pkg.github.com',
        },
        // For a monorepo, update the 'pkgRoot' to the respective package directory, e.g. 'packages/api'.
        pkgRoot: pkgRoot as NpmOptions,
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): set ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ] as PluginConfig[],
};

export default config;
