# Voltz V2 Off-Chain Monorepo

The Voltz V2 Off-Chain Monorepo contains the off-chain components of the Voltz platform, including the Indexer,
Transformer, and API. The Indexer fetches and parses EVM events, publishing them to Google Pub/Sub. The Transformer
leverages Apache Beam SDK to create dataflow pipelines that subscribe to events from the Indexer, enabling an
event-driven architecture. The API connects to Google BigTable, the destination for dataflow pipelines in the
Transformer, to provide access to market, position, and other relevant data for Voltz V2.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Build and Test Pipeline](#build-and-test-pipeline)
3. [Release Pipeline](#release-pipeline)
4. [Contributing](#contributing)
5. [Appendix](#appendix)
6. [License](#license)
7. [Outstanding](#outstanding)

## Getting Started

To set up the project locally for development, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Voltz-Protocol/v2-off-chain-monorepo.git
cd voltz-v2-offchain-monorepo
```

Install dependencies:

```yarn install```

Start the development environment for each package (Indexer, and API) as needed. For example:

```yarn dev:indexer```

Note, transformer repo is an exception since it is written in python and is not compatible with yarn.

## Build and Test Pipeline

This project uses GitHub Actions to automate the build and test pipeline. The workflow is triggered on push and pull
request events to the `main` branch. The pipeline consists of the following steps:

1. **Setup Node.js**: Set up the specified Node.js version and configure the npm registry URL for GitHub Packages.
2. **Install dependencies**: Install the project dependencies using Yarn.
3. **Run linter**: Check the code quality using the project's linter (e.g., ESLint).
4. **Check formatting**: Verify that the code is formatted according to the project's style guide (e.g., Prettier).
5. **Build packages**: Compile the TypeScript source files and build the project.
6. **Test packages**: Run unit tests for the project.

## Release Pipeline

This project uses Semantic Release to automate the release pipeline. The release process is triggered by a push to
the `main` branch and runs only after the build and test pipeline is successful. The pipeline is also managed by a
GitHub Actions workflow and consists of the following steps:

1. **Setup Node.js**: Set up the specified Node.js version and configure the npm registry URL for GitHub Packages.
2. **Install dependencies**: Install the project dependencies using Yarn.
3. **Release**: Run the Semantic Release process, which includes:
    - Analyzing commits to determine the next release version.
    - Generating release notes.
    - Updating the changelog file.
    - Publishing the new package version to GitHub Packages Registry.
    - Creating a GitHub release with the generated release notes.

### Release Configuration

Provide an overview of the project's Semantic Release configuration. Describe the plugins used and their purpose.

## Contributing

Explain the contribution process, including:

- How to report bugs or request features
- How to submit pull requests

## Appendix

### Apache Beam SDK

Apache Beam is an open-source unified programming model that allows developers to define and execute data processing
pipelines. It supports multiple languages and runtime environments, including Google Cloud Dataflow. In this project,
the Apache Beam SDK is used to create dataflow pipelines in the Transformer component.

## License

MIT

## Lerna Configuration

Our monorepo uses Lerna to manage the publishing of packages while maintaining semantic-release for versioning. Here is
an overview of the key features of our Lerna configuration:

1. **Package Manager**: We use Yarn as the package manager, and Yarn workspaces are enabled to manage inter-package
   dependencies.
2. **Independent Versioning**: Each package in the monorepo has independent versioning, managed by semantic-release.
3. **Publishing**: Lerna is responsible for publishing packages to npm. Git commits and tags related to versioning are
   managed by semantic-release.
4. **Excluding Python Package**: We've excluded the Python package located at `packages/transformer` from being managed
   by Lerna. This package is managed separately using Python-specific tooling.

By using this configuration, our monorepo benefits from the publishing capabilities of Lerna, while leveraging the
powerful versioning features of semantic-release.

