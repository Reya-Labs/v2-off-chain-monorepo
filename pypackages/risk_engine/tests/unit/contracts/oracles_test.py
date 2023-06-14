import math
import unittest

import risk_engine.src.oracles.rate.math as oracle_math
from pytest import approx, raises
from risk_engine.src.evm.block import Block
from risk_engine.src.oracles.rate.mock import MockRateOracle
from risk_engine.src.oracles.rate.rateOracle import Observation as RateObservation
from risk_engine.src.oracles.twap.twap import TWAP


def tick_to_price(tick: int) -> float:
    return 1.0001**tick


def price_to_tick(price: float) -> int:
    return math.floor(math.log(price, 1.0001))


def assert_prices_are_close(price1: float, price2: float):
    """Close in this context is within 0.15% of each other"""
    max_price = max(price1, price2)
    min_price = min(price1, price2)
    assert max_price <= 1.0015 * min_price, "prices are not close"


def assert_ticks_are_close(tick1: int, tick2: int):
    """Close in this context means that the prices are within 0.15%"""
    price1 = tick_to_price(tick1)
    price2 = tick_to_price(tick2)
    assert_prices_are_close(price1, price2)


class test_twap(unittest.TestCase):
    def setUp(self) -> None:
        block = Block(relative_block_position=0)
        self.twap = TWAP(block)
        self.block = block.next()

    def test_read_two_blocks_exactly(self) -> None:
        """Set two data points and read rate for the exact block time - one or two blocks"""
        self.twap.update_oracle(1000)
        self.block.next()
        self.twap.update_oracle(2000)
        self.block.next()
        read1 = self.twap.read_oracle(desired_age=12)
        assert_ticks_are_close(read1, 2000)
        read2 = self.twap.read_oracle(desired_age=24)
        assert_ticks_are_close(read2, 1500)

    def test_read_two_blocks(self) -> None:
        """Set two data points and read rate for less than the exact block time - one or two blocks"""
        self.twap.update_oracle(1000)

        self.block.next()
        self.twap.update_oracle(2000)

        self.block.next()
        read1 = self.twap.read_oracle(5)
        assert_ticks_are_close(read1, 2000)

        read2 = self.twap.read_oracle(18)
        assert_ticks_are_close(read2, 1666)

    def test_single_block_attack(self) -> None:
        """Set two data points and read rate for less than the exact block time - one or two blocks"""
        self.twap.update_oracle(1000)

        self.block.skip_forward_block(100)
        self.twap.update_oracle(200000)

        self.block.next()
        self.twap.update_oracle(1000)

        self.block.skip_forward_block(100)
        read1 = self.twap.read_oracle(201 * 12)

        assert_ticks_are_close(read1, 1990)


class test_mock_rate_oracle(unittest.TestCase):
    def setUp(self) -> None:
        data = [
            RateObservation(1000, 1),
            RateObservation(2000, 1.91),
            RateObservation(1900, 1.9),
        ]
        self.mock_rate = MockRateOracle(data)
        self.block = Block(relative_block_position=0)

    def test_index_at(self) -> None:
        """Set two data points and read rate for less than the exact block time - one or two blocks"""
        b = self.block  # ignored by mock but needed to satisfy interface
        assert self.mock_rate.index_at(1000, b) == 1
        assert self.mock_rate.index_at(1450, b) == 1.45
        assert self.mock_rate.index_at(1900, b) == 1.9
        assert self.mock_rate.index_at(2000, b) == 1.91
        assert self.mock_rate.index_at(1950, b) == approx(1.905)

        with raises(Exception) as excinfo:
            self.mock_rate.index_at(2001, b)
        assert "No mocked rate at this timestamp" in str(excinfo.value)

        with raises(Exception) as excinfo:
            assert self.mock_rate.index_at(999, b) == approx(1)
        assert "No mocked rate at this timestamp" in str(excinfo.value)


def test_linear_interpolation():
    start = RateObservation(0, 1.0)
    end = RateObservation(1000, 1.1)
    assert oracle_math.linear_interpolate(start, end, 500) == 1.05


if __name__ == "__main__":
    unittest.main()
