from dataclasses import dataclass
from typing import Optional

from pypackages.risk_engine.src.evm.block import Block
from pypackages.risk_engine.src.oracles.ringBuffer import RingBuffer
from pypackages.risk_engine.src.oracles.twap import constants


@dataclass  # generates __init__, __repr__, etc.
class Observation:
    """A single observation of price"""

    tick: int
    duration: int  # in seconds


def quantise_tick(tick: int) -> int:
    return (
        tick + (-(constants.TICK_TRUNCATION - 1) if tick < 0 else 0)
    ) // constants.TICK_TRUNCATION


def unquantise_tick(tick: int) -> int:
    return tick * constants.TICK_TRUNCATION + (constants.TICK_TRUNCATION // 2)


class TWAP:
    """A class for calculating the time-weighted geometric mean of observed prices, based loosely on the design of https://github.com/euler-xyz/median-oracle/"""

    def __init__(self, block: Block):
        # Larger buffers cost more to initialise so size may need to be variable in solidity
        # There is no downside to a large buffer (it does not affect gas cost, unlike Uniswap's implementation) so we use a large one here
        self.buffer: RingBuffer[Observation] = RingBuffer(500)
        self.curr_tick: Optional[int] = None
        self.last_update = block.timestamp
        self.block = block

    def update_oracle(self, new_tick: int):
        """Write a new tick value to the oracle. Should be called whenever the tick changes."""
        if self.curr_tick is not None:
            last_tick = self.curr_tick

            if quantise_tick(new_tick) == quantise_tick(last_tick):
                return

            elapsed = self.block.timestamp - self.last_update

            self.buffer.append(Observation(quantise_tick(last_tick), elapsed))
        else:
            pass

        self.last_update = self.block.timestamp
        self.curr_tick = new_tick

    def read_oracle(self, desired_age: int):
        """Reads a time-weighted tick value from the oracle.

        This is the
        """
        tick_accum = 0  # stores the sum of (tick_value * time_spent_at_tick) for all observations processed so far
        actual_age = 0

        current_duration = self.block.timestamp - self.last_update

        if not self.curr_tick:
            raise Exception("Cannot read from oracle before anything has been written")

        observations = self.buffer.get()

        if desired_age == 0 or sum(map(lambda obs: obs.duration, observations)) == 0:
            return self.curr_tick

        if current_duration != 0:
            # Work out how long we've been at the current tick
            if current_duration > desired_age:
                current_duration = desired_age

            actual_age += current_duration
            tick_accum += self.curr_tick * current_duration

        while observations and actual_age != desired_age:
            observation = observations.pop()
            duration = observation.duration

            if actual_age + duration > desired_age:
                duration = desired_age - actual_age
            actual_age += duration

            tick_accum += unquantise_tick(observation.tick) * duration

        return tick_accum / actual_age
