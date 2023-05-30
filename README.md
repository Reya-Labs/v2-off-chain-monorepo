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

### Google BigTable

Google BigTable is a key-value and wide-column store, ideal for fast access to very large amounts of structured, 
semi-structured, or unstructured data with high read and write throughput.

When creating a table, the first step is to choose the schema and most importantly, to define the column families.
Let's consider that table has columns R_1, R_2, ..., R_N. Column families help you to group these in families 
F_1: {R_i_1, R_i_2, ... }, F_2: {R_j_1, R_j_2, ...}, ...

The role of column families is mainly to organise the database cleaner and to serve queries where you need to pull
just one family, or given families. 

When pushing data to BigTable, you need to specify the key (unique key per table) and data for that key. 
Data is column family -> column qualifier (column name) -> { value, timestamp, labels }[]. 

Note: Values are only raw byte strings. Timestamp is used to build the time-series. 

When pulling data, you are able to pull specific row (by providing key) or all rows. 
You are also able to provide filters when pulling data.

Use case: Pushing raw taker orders 

1. Create table: (packages/indexer/src/services/big-table/taker-orders-table/createTakerOrdersTable.ts)

   The Taker Orders BigTable have only 1 column family (we'll explore this further to understand this better
but currently, 1 column family is equivalent to usual tables). 

2. Push events to table: (packages/indexer/src/services/big-table/taker-orders-table/pushTakerOrders.ts)

   We're able to push more events in the same call to the table. We need to map them as:
   ``
   {
      key: event.id,
      data: {
         [column family id]: {
            id: {
               value: event.id,
               timestamp,
            },
            blockNumber: {
               value: event.blockNumber,
               timestamp,
            },
            ...
         }
      }
   }
   ``

3. Then we can either pull one particular event (packages/indexer/src/services/big-table/taker-orders-table/pullTakerOrderRow.ts)
or all events at once (packages/indexer/src/services/big-table/taker-orders-table/pullAllTakerOrderRows.ts)

The full integration test is (packages/indexer/tests/integration-tests/bigtable.ts).

Next steps:
   - Understand better the column family concept and query filters. 
   - Undestand better the concept of time-series for one particular cell.
   - Introduce functionality for modification of particular value. 
   - Measure time of queries with proper samples.

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

