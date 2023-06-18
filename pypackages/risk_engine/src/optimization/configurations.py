from dataclasses import dataclass
from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters

@dataclass
class ProtocolRiskConfiguration:
    im_multiplier: float

@dataclass
class MarketRiskConfiguration:
    risk_parameter: float
    twapLookbackWindowInDays: float

@dataclass
class LiquidationConfiguration:
    liquidator_reward_parameter: float

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
    liquidation_configuration: LiquidationConfiguration
    protocol_risk_configuration: ProtocolRiskConfiguration
    market_fee_configuration: MarketFeeConfiguration
    dated_irs_market_configuration: DatedIRSMarketConfiguration
    vamm_configuration: VAMMConfiguration

@dataclass
class IMOptimizationConfiguration:
    number_of_optuna_trials: int
    min_acceptable_leverage: float
    liquidation_configuration: LiquidationConfiguration
    market_risk_configuration: MarketRiskConfiguration
    market_fee_configuration: MarketFeeConfiguration
    dated_irs_market_configuration: DatedIRSMarketConfiguration
    vamm_configuration: VAMMConfiguration