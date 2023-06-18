"""
Basic implementation of the market impact model, I = cst * Q^beta
for a market order Q, which we apply to the TWAP

Here we also place the market-specific slippage parameters, which will be called
in the main code to parameterise the slippage correction, cst * Q^beta
"""
# Current example parameters
slippage_parameters = {"aUSDC_IRS": {"phi": 2e-5, "beta": 1.02}}


class Slippage:
    def __init__(self, market_factor: float, beta: float = 0.5) -> None:
        self.market_factor: float = market_factor
        self.beta: float = beta

    def model(self, order_size: float) -> float:

        slippage: float = self.market_factor * pow(order_size, self.beta)

        return slippage

    def apply_correction(
        self, order_size: float, uncorrected_value: float = 1
    ) -> float:
        model = self.model(order_size=order_size)
        if uncorrected_value > 0:
            return uncorrected_value * (1 + model)
        return uncorrected_value * (1 - model)
