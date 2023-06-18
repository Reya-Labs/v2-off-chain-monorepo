from dataclasses import dataclass
from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters

@dataclass
class ProtocolRiskConfiguration:

    im_multiplier: float
    liquidator_reward_parameter: float

@dataclass
class MarketRiskConfiguration:

    risk_parameter: float
    # todo: consider lowering granularity to seconds/hours
    twapLookbackWindowInDays: float

@dataclass
class MarketFeeConfiguration:

    maker_fee_parameter: float
    taker_fee_parameter: float


@dataclass
class DatedIRSMarketConfiguration:
    market_name: str
    quote_token: str

@dataclass
class VAMMConfiguration:
    lp_spread: float
    slippage_model_parameters: SlippageModelParameters

@dataclass
class MarketParameterOptimizationConfiguration:

    number_of_optuna_trials: int
    min_acceptable_leverage: float


@dataclass
class IMOptimizationConfiguration:

    number_of_optuna_trials: int
    min_acceptable_leverage: float