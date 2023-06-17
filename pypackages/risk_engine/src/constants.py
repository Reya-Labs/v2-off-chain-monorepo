DAY_IN_SECONDS = 24 * 60 * 60
MONTH_IN_SECONDS = 30 * DAY_IN_SECONDS
YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS
FIRST_MAINNET_POS_BLOCK = 15537394
FIRST_MAINNET_POS_BLOCK_TIMESTAMP = 1663220562
POS_SECONDS_PER_BLOCK = 12

Z_SCORES_DICT: dict = {95: 1.96, 99: 2.58}

# defaults
MARKET_NAME = 'dated_irs_ausdc_borrow'
COLLATERAL_TOKEN_NAME = 'USDC'
INITIAL_FIXED_RATE = 0.05
LP_SPREAD = 0.005
MAKER_FEE = 0.0
TAKER_FEE = 0.0
# todo: double check if in seconds and change var name accordingly
LIQUIDATOR_REWARD = 0.01
STANDARDIZED_TAKER_NOTIONAL = 1.0
STANDARDIZED_MAKER_NOTIONAL = 1.0

# default (tunable) configurations

DEFAULT_GWAP_LOOKBACK = 3600
DEFAULT_RISK_PARAMETER = 0.02
DEFAULT_P_LM = 0.02 # note has a relationship with the risk parameter
DEFAULT_IM_MULTIPLIER = 1.5
DEFAULT_SLIPPAGE_PHI = 0.01
DEFAULT_SLIPPAGE_BETA = 0.02
DEFAULT_GAMMA = 0.01


## simulations

MOCK_SIMULATION_SET = [
    "mock_ausdc_borrow_rate"
]

DEFAULT_ACCEPTABLE_LEVERAGE_THRESHOLD = 30


## oracle simulator

# A hashmap or oracle names based
# on the instrument and market, and the
# associated call required to access that oracle
# data e.g. could be an API call, or we might
# need to directly access a Chainlink oracle.

# This is to be confirmed
MOCK_ORACLE_MAP = {
    "dated_irs_ausdc_borrow_liquidity_index": "mock_ausdc_borrow_rate.csv",
}