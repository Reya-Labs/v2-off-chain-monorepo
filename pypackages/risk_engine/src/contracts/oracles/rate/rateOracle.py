from dataclasses import dataclass

from risk_engine.src.evm.block import Block


@dataclass  # generates __init__, __repr__, etc.
class Observation:
    """A single observation of a rate"""

    timestamp: int  # seconds since epoch
    rate: float


class RateOracle:
    """An interface for storing, extrapolating and interpolating liquidity index values for a particular underlying instrument"""

    def update_oracle(self, block: Block):
        """Get a new rate from source (e.g. the underlying platform) and store it in oracle. Should be called periodically to keep rates up to date."""
        raise Exception("Please use a concrete subclass of RateOracle")

    def current_index(self, block: Block):
        """Returns the current liquidity index of the underlying, extrapolating from known data points if required"""
        return self.index_at(block.timestamp, block)

    def index_at(self, time: int, block: Block):
        """Returns the liquidity index of the underlying at the specified timestamp, extrapolating from known data points if required"""
        raise Exception("Please use a concrete subclass of RateOracle")

    def index_ratio_between(
        self, start_time: int, end_time: int, block: Block
    ) -> float:
        """Returns the ratio of the ending liquidity index to the starting liquidity index as a float (e.g. 1.1 if index increased by 10%)"""
        raise Exception("Please use a concrete subclass of RateOracle")

    def index_ratio_since(self, start_time: int, block: Block) -> float:
        """Returns the ratio or the current liquidity index to the starting liquidity index as a float (e.g. 1.1 if index increased by 10%)"""
        return self.index_ratio_between(start_time, block.timestamp, block)
