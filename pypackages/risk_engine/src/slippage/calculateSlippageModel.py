from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters
from pandas import Series


def calculate_slippage_model(slippage_model_parameters: SlippageModelParameters, notional_in_quote: Series) -> Series:
    return notional_in_quote.pow(slippage_model_parameters.slippage_beta).mul(slippage_model_parameters.slippage_phi)
