# Voltz V2 Risk Engine

## Pants

### Installing Pants

On MacOS Pants can be installed via brew using the command below:

```bash
brew install pantsbuild/tap/pants
```

For alternative ways to install pants refer to https://www.pantsbuild.org/docs/installation.

### Goals

Pants commands are referred to as goals, a list of goals can be found by running the following command:

```bash
pants help goals
```

### List targets

```bash 
pants list ::  # All targets.
```

### Run formatters and linters

```bash
pants fmt ::
pants lint ::
```

### Run MyPy

```bash
pants check ::
```

### Run tests

```bash
pants test ::  # Run all tests in the repo.
pants test --output=all ::  # Run all tests in the repo and view pytest output even for tests that passed (you can set this permanently in pants.toml).
pants test helloworld/translator:tests  # Run all the tests in this target.
pants test helloworld/translator/translator_test.py  # Run just the tests in this file.
pants test helloworld/translator/translator_test.py -- -k test_unknown_phrase  # Run just this one test by passing through pytest args.
```

### Create virtualenv for IDE integration

```bash
pants export ::
```

### Source Roots 

In order to list all the python source roots, we can run the following commands, more details about
source root configuration in pants refer to https://www.pantsbuild.org/docs/source-roots

```bash
pants roots
```

### Third Party Dependencies 

Pants understands exactly which dependencies every file in the project needs, and efficiently uses just that
subset of dependencies needed for the task:

#### Lockfiles

Lockfiles are strongly recommended as they make the builds more stable (https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/) .

### Export Env

In order to create a virtual environment, run the following command:

```bash
pants export --symlink-python-virtualenv --resolve=python-default
```