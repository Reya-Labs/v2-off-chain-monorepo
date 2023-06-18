from dataclasses import dataclass



@dataclass  # generates __init__, __repr__, etc.
class SlippageModelParameters:
    """Slippage Model Parameters"""

    slippage_phi: float
    slippage_beta: float



def run_slippage_model_optimization() -> SlippageModelParameters:


    pass




