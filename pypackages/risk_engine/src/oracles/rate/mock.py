from bisect import bisect
from .math import linear_interpolate
from pypackages.risk_engine.src.oracles.rate.rateOracle import Observation, RateOracle
from pypackages.risk_engine.src.evm.block import Block

# todo: consider moving to tests/mocks

class MockRateOracle(RateOracle):
    """An interface for storing, extrapolating and interpolating liquidity index values for a particular underlying instrument"""

    def __init__(self, obs: list[Observation]):
        # Order the observations
        self.ordered_obs = sorted(obs, key=lambda x: x.timestamp)

    def update_oracle(self, block: Block):
        """Get a new rate from source (e.g. the underlying platform) and store it in oracle. Should be called periodically to keep rates up to date."""
        raise Exception("Reading rates from platform not supported by MockRateOracle")

    def index_at(self, time: int, block: Block) -> float:
        """Returns the liquidity index of the underlying at the specified timestamp, extrapolating from known data points if required"""
        index = bisect(self.ordered_obs, time, key=lambda o: o.timestamp)

        if index == 0:
            # No observation at or before requested time
            raise Exception("No mocked rate at this timestamp")

        obs_before = self.ordered_obs[index - 1]
        delta = time - obs_before.timestamp
        if delta == 0:
            return obs_before.rate
        elif index == len(self.ordered_obs):
            # No observation at or after requested time
            raise Exception("No mocked rate at this timestamp")
        else:
            obs_after = self.ordered_obs[index]
            return linear_interpolate(obs_before, obs_after, delta)

    def index_ratio_between(self, start_time: int, end_time: int, block: Block) -> float:
        """Returns the ratio of the ending liquidity index to the starting liquidity index as a float (e.g. 1.1 if index increased by 10%)"""
        value_before = self.index_at(start_time, block)
        value_after = self.index_at(end_time, block)
        return value_after / value_before
