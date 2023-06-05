# Voltz V2 Risk Engine

## Dependencies

[`python`](https://www.python.org/downloads/) += 3.11.1 and [`poetry`](https://python-poetry.org/docs/#installation) to manage python package dependencies.

## Get started

Install python packages in a virtual environment:

```sh
poetry install
```

## Testing

To run all tests:

```sh
poetry run pytest
```

To run all tests and print any console output:

```sh
poetry run pytest -s
```

Example of running a specific test file:

```sh
poetry run pytest tests/test_oracles.py
```

Example of running only some specific test case(s) matching a pattern:

```sh
poetry run pytest test/test_oracles.py -k "latest_round_data or some_other_test_case_substring"
```

## Check code

Run the pre-commit hooks:

```sh
poetry run pre-commit run --all-files
```

## Terminology
Free Collateral 

## Run simulations to output margin requirements and unrealized PnLs in different markets

There should be a folder in the root directory called ``data``. (Otherwise, please create it and git ignore it).

Each dataset in the ``data`` folder should be in ``.csv`` format and should consist of three columns: ``timestamp``, ``liquidity_index`` and ``apy``.

Once the process is executed (command below), the simulation will be run for each dataset and the results will be written in ``simulations/margin_requirements/outputs``.

```sh
poetry run output-margin-requirements
```

## Ongoing work / next priorities

introduce market manager smart contract?
keeps track of which markets exist
and is potentially the main window between a given market and the rest of the system

introduce a feature flag module?

same pool on top of multiple markets idea -> further generalisability (ref: synthetix staking)?

split files into folders: core, markets, pools, oracles, etc

consider splitting the margin engine into the collateral engine and liquidation engine

can we make complexity O(a) where a is the number of positions which have been affected since latest calculation of  margin requirements

annualized notional calculation in context of swaps

## CyclopsRex plan

Look at oracles:

- chainlink style
- rate style (Voltz)
- something suitable for predicting unrealised profit/loss, factoring in current VAMM rates - fees and cost of an unwind. See proposal for "GWAP", but consider possible simplifications/efficiencies re: saving gas.