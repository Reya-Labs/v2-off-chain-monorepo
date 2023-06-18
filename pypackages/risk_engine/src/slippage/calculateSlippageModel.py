from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters


def calculate_slippage_model(slippage_model_parameters: SlippageModelParameters, notional_in_quote: float) -> float:
    return slippage_model_parameters.slippage_phi * (notional_in_quote ** slippage_model_parameters.slippage_beta)
