import unittest
from unittest import mock

from risk_engine.src.constants import MONTH_IN_SECONDS, YEAR_IN_SECONDS
from risk_engine.src.evm.block import Block
from risk_engine.src.exchanges.vamm.vamm import VAMM
from risk_engine.tests.mocks.mockOracle import MockOracle


class MockPool(VAMM):
    def __init__(
        self,
        block,
        min_tick,
        max_tick,
        tick_spacing,
    ):

        # initialize the super class
        super().__init__(
            block=block,
            min_tick=min_tick,
            max_tick=max_tick,
            tick_spacing=tick_spacing,
        )

    # Overriden functions

    def vamm_f(self, tick):
        return tick

    def inv_vamm_f(self, tick):
        return tick

    def no_of_trackers(self):
        return 2

    def _track_variable_tokens(self, base):
        return base

    def _track_fixed_tokens(self, base, tick_lower, tick_upper):
        avg_price = (tick_upper + tick_lower) / 200000
        time_delta = MONTH_IN_SECONDS / YEAR_IN_SECONDS
        return -base * (avg_price * time_delta + 1)

    def _track(self, index_tracker, base, tick_lower, tick_upper):
        if index_tracker == 0:
            return self._track_variable_tokens(base=base)

        if index_tracker == 1:
            return self._track_fixed_tokens(
                base=base, tick_lower=tick_lower, tick_upper=tick_upper
            )

        raise Exception("base pool: non-existing tracker index")


class TestVAMM(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)

        self.oracle = MockOracle()
        self.oracle.mock_latest(return_value=1)

        self.pool = MockPool(
            block=self.block,
            min_tick=0,
            max_tick=100000,
            tick_spacing=10,
        )

        self.pool.initialize(current_tick=5000)

    def test_convert_tick(self):
        self.assertAlmostEqual(self.pool.vamm_f(1000), 1000)

    def test_no_of_trackers(self):
        self.assertAlmostEqual(self.pool.no_of_trackers(), 2)

    def test_check_tick(self):
        # successfull check of tick 0
        self.pool.check_tick(0)

        # successfull check of tick 100
        self.pool.check_tick(100)

        # unsuccessfull check of tick -100
        with self.assertRaisesRegex(Exception, "vamm: tick < MIN tick"):
            self.pool.check_tick(-100)

        # unsuccessfull check of tick 100100
        with self.assertRaisesRegex(Exception, "vamm: tick > MAX tick"):
            self.pool.check_tick(100100)

        # unsuccessfull check of tick 13
        with self.assertRaisesRegex(
            Exception, "vamm: tick not multiple of tick spacing"
        ):
            self.pool.check_tick(13)

    def test_check_ticks(self):
        # successfull check of ticks (0, 100)
        self.pool.check_ticks(0, 100)

        # unsuccessfull check of ticks (100, 0)
        with self.assertRaisesRegex(Exception, "vamm: lower tick >= upper tick"):
            self.pool.check_ticks(100, 0)

        # unsuccessfull check of ticks (0, 13)
        with self.assertRaisesRegex(
            Exception, "vamm: tick not multiple of tick spacing"
        ):
            self.pool.check_ticks(0, 13)

        # unsuccessfull check of ticks (-1, 100)
        with self.assertRaisesRegex(Exception, "vamm: tick < MIN tick"):
            self.pool.check_ticks(-1, 100)

        # unsuccessfull check of ticks (0, 100001)
        with self.assertRaisesRegex(Exception, "vamm: tick > MAX tick"):
            self.pool.check_ticks(0, 100001)

    def test_closest_tick(self):
        self.assertAlmostEqual(self.pool.closest_tick(tick=5006), 5010)
        self.assertAlmostEqual(self.pool.closest_tick(tick=5001), 5000)
        self.assertAlmostEqual(self.pool.closest_tick(tick=5000), 5000)

    def test_next_crossable_tick(self):
        self.pool._ticks.update(
            {
                3000: {"average_base": 0, "growths": [0, 0]},
                18000: {"average_base": 0, "growths": [0, 0]},
            }
        )

        left_tick = self.pool.next_crossable_tick(direction="left")
        right_tick = self.pool.next_crossable_tick(direction="right")

        self.assertAlmostEqual(left_tick, 3000)
        self.assertAlmostEqual(right_tick, 18000)

    def test_average_base(self):
        average_base = self.pool.average_base(
            base=1000,
            tick_lower=100,
            tick_upper=200,
        )

        self.assertAlmostEqual(average_base, 10)

    def test_average_base_exponential(self):

        average_base = self.pool.average_base(
            base=1000,
            tick_lower=100,
            tick_upper=200,
        )

        self.assertAlmostEqual(average_base, 10)

    def test_base_between_ticks(self):

        base_between_ticks = self.pool.base_between_ticks(
            accumulator=10,
            from_tick=100,
            to_tick=200,
        )

        self.assertAlmostEqual(base_between_ticks, 1000)

    def test_growth_between_ticks_current_tick_in_range(self):

        tick_lower = 2000
        tick_upper = 6000

        self.pool._ticks.update(
            {tick_lower: {"growths": [10, 8]}, tick_upper: {"growths": [5, 6]}}
        )

        self.pool._growths = [20, 20]

        growths = self.pool.growth_between_ticks(
            tick_lower=tick_lower, tick_upper=tick_upper
        )

        self.assertEqual(growths, [5, 6])

    def test_growth_between_ticks_current_tick_down(self):

        tick_lower = 6000
        tick_upper = 8000

        self.pool._ticks.update(
            {tick_lower: {"growths": [10, 8]}, tick_upper: {"growths": [5, 6]}}
        )

        self.pool._growths = [20, 20]

        growths = self.pool.growth_between_ticks(
            tick_lower=tick_lower, tick_upper=tick_upper
        )

        self.assertEqual(growths, [5, 2])

    def test_growth_between_ticks_current_tick_up(self):

        tick_lower = 2000
        tick_upper = 3000

        self.pool._ticks.update(
            {tick_lower: {"growths": [10, 8]}, tick_upper: {"growths": [5, 6]}}
        )

        self.pool._growths = [20, 20]

        growths = self.pool.growth_between_ticks(
            tick_lower=tick_lower, tick_upper=tick_upper
        )

        self.assertEqual(growths, [-5, -2])

    def test_tracked_values_between_ticks_outside(self):
        tracked_values = self.pool.tracked_values_between_ticks_outside(
            average_base=10, tick_lower=5000, tick_upper=6000
        )

        self.assertAlmostEqual(tracked_values[0], -10000)
        self.assertAlmostEqual(tracked_values[1], 10045.205479452055)

    def test_tracked_values_between_ticks_in_range(self):
        (
            tracked_values_left,
            tracked_values_right,
        ) = self.pool.tracked_values_between_ticks(
            base=20000, tick_lower=4000, tick_upper=6000
        )

        self.assertAlmostEqual(tracked_values_left[0], 10000)
        self.assertAlmostEqual(tracked_values_left[1], -10036.986301369863)

        self.assertAlmostEqual(tracked_values_right[0], -10000)
        self.assertAlmostEqual(tracked_values_right[1], 10045.205479452055)

    def test_tracked_values_between_ticks_down(self):
        (
            tracked_values_left,
            tracked_values_right,
        ) = self.pool.tracked_values_between_ticks(
            base=20000, tick_lower=2000, tick_upper=4000
        )

        self.assertAlmostEqual(tracked_values_left[0], 20000)
        self.assertAlmostEqual(tracked_values_left[1], -20049.31506849315)

        self.assertAlmostEqual(tracked_values_right[0], 0)
        self.assertAlmostEqual(tracked_values_right[1], 0)

    def test_tracked_values_between_ticks_up(self):
        (
            tracked_values_left,
            tracked_values_right,
        ) = self.pool.tracked_values_between_ticks(
            base=20000, tick_lower=6000, tick_upper=8000
        )

        self.assertAlmostEqual(tracked_values_left[0], 0)
        self.assertAlmostEqual(tracked_values_left[1], 0)

        self.assertAlmostEqual(tracked_values_right[0], -20000)
        self.assertAlmostEqual(tracked_values_right[1], 20115.068493150684)

    def test_gwap_tick(self):
        self.pool.gwap_oracle.read_oracle = mock.Mock(return_value=10000)

        self.assertAlmostEqual(self.pool.gwap_tick(desired_age=3600), 10000)

        self.pool.gwap_oracle.read_oracle.assert_called_with(desired_age=3600)

    def test_vamm_mint(self):
        self.pool.vamm_mint(tick_lower=4000, tick_upper=6000, base=20000)

        self.assertAlmostEqual(self.pool._accumulator, 10)

        ticks = self.pool._ticks
        self.assertAlmostEqual(ticks[4000]["average_base"], 10)

        self.assertAlmostEqual(ticks[6000]["average_base"], -10)

    def test_vamm_mint_twice(self):
        self.pool.vamm_mint(tick_lower=4000, tick_upper=6000, base=20000)

        self.pool.vamm_mint(tick_lower=6000, tick_upper=8000, base=30000)

        self.assertAlmostEqual(self.pool._accumulator, 10)

        ticks = self.pool._ticks
        self.assertAlmostEqual(ticks[4000]["average_base"], 10)
        self.assertAlmostEqual(ticks[6000]["average_base"], 5)
        self.assertAlmostEqual(ticks[8000]["average_base"], -15)

    def test_vamm_swap_positive_base_low_liquidity(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=2000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=2000)

        # Check result
        self.assertAlmostEqual(deltas[0], 1000)
        self.assertAlmostEqual(deltas[1], -1004.9315068493149)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 100000)

    def test_vamm_swap_positive_base_restrictive_tick_limit(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)
        self.pool.vamm_mint(tick_lower=6000, tick_upper=8000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=400, tick_limit=6000)

        # Check result
        self.assertAlmostEqual(deltas[0], 250)
        self.assertAlmostEqual(deltas[1], -251.1301369863)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 6000)

    def test_vamm_swap_positive_base_restrictive_tick_limit_more_ticks(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)
        self.pool.vamm_mint(tick_lower=4000, tick_upper=6000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=2000, tick_limit=6500)

        # Check result
        self.assertAlmostEqual(deltas[0], 875)
        self.assertAlmostEqual(deltas[1], -879.0325342465753)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 6500)

    def test_vamm_swap_positive_base(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=400)

        # Check result
        self.assertAlmostEqual(deltas[0], 400)
        self.assertAlmostEqual(deltas[1], -401.9068493150685)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 6600)

    def test_vamm_swap_positive_base_more_ticks(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)
        self.pool.vamm_mint(tick_lower=4000, tick_upper=6000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=800)

        # Check result
        self.assertAlmostEqual(deltas[0], 800)
        self.assertAlmostEqual(deltas[1], -803.641095890411)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 6200)

    def test_vamm_swap_negative_base_low_liquidity(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=2000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=-2000)

        # Check result
        self.assertAlmostEqual(deltas[0], -1000)
        self.assertAlmostEqual(deltas[1], 1003.2876712328766)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 0)

    def test_vamm_swap_negative_base_restrictive_tick_limit(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)
        self.pool.vamm_mint(tick_lower=6000, tick_upper=8000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=-400, tick_limit=4000)

        # Check result
        self.assertAlmostEqual(deltas[0], -250)
        self.assertAlmostEqual(deltas[1], 250.9246575342466)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 4000)

    def test_vamm_swap_negative_base_restrictive_tick_limit_more_ticks(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)
        self.pool.vamm_mint(tick_lower=4000, tick_upper=6000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=-2000, tick_limit=3500)

        # Check result
        self.assertAlmostEqual(deltas[0], -875)
        self.assertAlmostEqual(deltas[1], 878.1592465753424)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 3500)

    def test_vamm_swap_negative_base(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=-400)

        # Check result
        self.assertAlmostEqual(deltas[0], -400)
        self.assertAlmostEqual(deltas[1], 401.3808219178082)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 3400)

    def test_vamm_swap_negative_base_more_ticks(self):
        # Mock liquidity
        self.pool.vamm_mint(tick_lower=3000, tick_upper=7000, base=1000)
        self.pool.vamm_mint(tick_lower=4000, tick_upper=6000, base=1000)

        # Trigger call
        deltas = self.pool.vamm_swap(base=-800)

        # Check result
        self.assertAlmostEqual(deltas[0], -800)
        self.assertAlmostEqual(deltas[1], 802.9342465753425)

        # Check state change
        self.assertAlmostEqual(self.pool._current_tick, 3800)


if __name__ == "__main__":
    unittest.main()
