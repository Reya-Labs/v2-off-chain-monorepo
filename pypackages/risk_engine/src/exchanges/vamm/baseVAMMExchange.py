from abc import abstractmethod

from typing_extensions import override

from pypackages.risk_engine.src.exchanges.vamm.vamm import VAMM


class BaseVAMMExchange(VAMM):
    def __init__(
        self,
        pool_id,
        block,
        min_tick,
        max_tick,
        tick_spacing,
        term_end_in_seconds,
        gwap_lookback=0,
    ):
        # pool id
        self.pool_id = pool_id

        # gwap lookback window in seconds
        self.gwap_lookback = gwap_lookback

        # duration of vamm
        self.term_end_in_seconds = term_end_in_seconds

        # positions
        self._positions = {}
        self._accounts = {}

        # initialize the super class
        super().__init__(
            block=block,
            min_tick=min_tick,
            max_tick=max_tick,
            tick_spacing=tick_spacing,
        )

    @override
    def vamm_f(self, tick):
        return tick

    @override
    def inv_vamm_f(self, tick):
        return tick

    @override
    def no_of_trackers(self):
        return 2

    @abstractmethod
    def _track_variable_tokens(self, base):
        pass

    @abstractmethod
    def _track_fixed_tokens(self, base, tick_lower, tick_upper):
        pass

    @override
    def _track(self, index_tracker, base, tick_lower, tick_upper):
        if index_tracker == 0:
            return self._track_variable_tokens(base=base)

        if index_tracker == 1:
            return self._track_fixed_tokens(
                base=base, tick_lower=tick_lower, tick_upper=tick_upper
            )

        raise Exception("base pool: non-existing _tracker index")

    def _get_raw_position(self, position_id):
        """
        It gets information about the position associated to position_id
        """
        if position_id in self._positions:
            self.__propagate_position(position_id=position_id)

            return self._positions[position_id]

        raise Exception("Position ID not found")

    # External getters
    def supported_maturities(self):
        return [self.term_end_in_seconds]

    def get_account_filled_balances(self, maturity, account_id):
        if maturity not in self.supported_maturities():
            raise Exception("Maturity not supported")

        if account_id not in self._accounts:
            return 0, 0

        base = 0
        quote = 0

        for position_id in self._accounts[account_id]["positions"]:
            position = self._get_raw_position(position_id=position_id)

            base += position["accumulated"][0]
            quote += position["accumulated"][1]

        return base, quote

    def get_account_filled_and_unfilled_balances(self, maturity, account_id):
        if maturity not in self.supported_maturities():
            raise Exception("Maturity not supported")

        if account_id not in self._accounts:
            return 0, 0, 0, 0

        filled_base = 0
        filled_quote = 0
        unfilled_base_long = 0
        unfilled_base_short = 0

        for position_id in self._accounts[account_id]["positions"]:
            position = self._get_raw_position(position_id=position_id)

            unfilled_long, unfilled_short = self.tracked_values_between_ticks(
                base=position["base"],
                tick_lower=position["tick_lower"],
                tick_upper=position["tick_upper"],
            )

            filled_base += position["accumulated"][0]
            filled_quote += position["accumulated"][1]

            unfilled_base_long += unfilled_long[0]

            unfilled_base_short += unfilled_short[0]

        return filled_base, filled_quote, unfilled_base_long, unfilled_base_short

    # Internal functions
    def __propagate_position(self, position_id):
        position = self._positions[position_id]
        if position["base"] == 0:
            return

        global_growths = self.growth_between_ticks(
            tick_lower=position["tick_lower"], tick_upper=position["tick_upper"]
        )

        for _tracker in range(self.no_of_trackers()):
            delta_growth = (
                global_growths[_tracker]
                - self._positions[position_id]["updated_growths"][_tracker]
            )

            average_base = self.average_base(
                base=self._positions[position_id]["base"],
                tick_lower=self._positions[position_id]["tick_lower"],
                tick_upper=self._positions[position_id]["tick_upper"],
            )

            self._positions[position_id]["updated_growths"][_tracker] = global_growths[
                _tracker
            ]
            self._positions[position_id]["accumulated"][_tracker] += (
                delta_growth * average_base
            )

    def __update_position_with_base(self, position_id, base):
        self._positions[position_id]["base"] += base

    def __open_position(self, account_id, lower_price, upper_price):
        """
        It opens a position and returns position_id
        """

        # Turn the price range into ticks
        tick_lower = self.tick_at_price(lower_price)
        tick_upper = self.tick_at_price(upper_price)

        # Check ticks on the underlying pools
        self.check_ticks(tick_lower, tick_upper)
        position_id = "-".join((account_id, str(tick_lower), str(tick_upper)))

        # Check if the position is new
        if position_id in self._positions:
            return position_id

        # Instantiate new position
        self._positions.update(
            {
                position_id: {
                    "account_id": account_id,
                    "tick_lower": tick_lower,
                    "tick_upper": tick_upper,
                    "base": 0,
                    "accumulated": [0, 0],
                    "updated_growths": [0, 0],
                }
            }
        )

        if account_id not in self._accounts:
            self._accounts.update(
                {
                    account_id: {
                        "positions": [],
                    }
                }
            )

        self._accounts[account_id]["positions"].append(position_id)

        # Return the ID
        return position_id

    # External functions
    def execute_limit_order(self, maturity, account_id, base, lower_price, upper_price):
        """
        It deploys base in the position associated to position_id
        """

        if maturity not in self.supported_maturities():
            raise Exception("Maturity not supported")

        position_id = self.__open_position(
            account_id=account_id, lower_price=lower_price, upper_price=upper_price
        )
        position = self._get_raw_position(position_id=position_id)

        if position["base"] + base < 0:
            raise Exception("trying to burn more than available")

        self.vamm_mint(
            tick_lower=position["tick_lower"],
            tick_upper=position["tick_upper"],
            base=base,
        )
        self.__update_position_with_base(position_id=position_id, base=base)

        executed_base_amount = self._track_variable_tokens(base=base)
        return executed_base_amount

    def _close_position(self, position_id):
        position = self._get_raw_position(position_id=position_id)

        base = -position["base"]
        self.vamm_mint(
            tick_lower=position["tick_lower"],
            tick_upper=position["tick_upper"],
            base=base,
        )

        self.__update_position_with_base(position_id=position_id, base=base)

        base = position["accumulated"][0]
        quote = position["accumulated"][1]

        for tracker in range(self.no_of_trackers()):
            position["accumulated"][tracker] = 0

        return base, quote

    def execute_market_order(self, maturity, base, price_limit=None):
        """
        It initiates a swap
        """

        if maturity not in self.supported_maturities():
            raise Exception("Maturity not supported")

        tick_limit = None if price_limit is None else self.tick_at_price(price_limit)

        deltas = self.vamm_swap(base=base, tick_limit=tick_limit)

        return deltas

    def close_positions(self, maturity, account_id):
        """
        It settles all positions associated to account_id for specific maturity
        """

        if maturity not in self.supported_maturities():
            raise Exception("Maturity not supported")

        if account_id not in self._accounts:
            return 0, 0

        closed_base = 0
        closed_quote = 0

        for position_id in self._accounts[account_id]["positions"]:
            base, quote = self._close_position(position_id=position_id)

            closed_base += base
            closed_quote += quote

        return closed_base, closed_quote

    def gwap(self, maturity):
        if maturity not in self.supported_maturities():
            raise Exception("Maturity not supported")

        price = self.price_at_tick(self.gwap_tick(desired_age=self.gwap_lookback))

        return price
