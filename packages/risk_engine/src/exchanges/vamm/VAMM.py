import math
from abc import ABC, abstractmethod
from packages.risk_engine.src.oracles.twap.twap import TWAP

class VAMM(ABC):
    def __init__(self, block, min_tick, max_tick, tick_spacing):
        # tick spacing
        self._tick_spacing = tick_spacing

        if min_tick >= max_tick:
            raise Exception("vamm init: lower tick >= upper tick")

        if not (min_tick % tick_spacing == 0 and max_tick % tick_spacing == 0):
            raise Exception("vamm init: ticks not multiple of tick spacing")

        # vAMM bounds
        self._min_tick = min_tick
        self._max_tick = max_tick + 1

        # information about ticks
        self._current_tick = None
        self._ticks = {}

        # global _trackers
        self._growths = [0] * self.no_of_trackers()
        self._accumulator = 0

        # capture block
        self.block = block

        # gwap tracker
        self.gwap_oracle = TWAP(block=block)

    def initialize(self, current_tick):
        self._current_tick = current_tick
        self.gwap_oracle.update_oracle(new_tick=current_tick)

    # Abstract methods
    @abstractmethod
    def vamm_f(self, tick):
        """
        vAMM distribution function
        """
        pass

    @abstractmethod
    def inv_vamm_f(self, tick):
        """
        Inverse of vAMM distribution function
        """
        pass

    @abstractmethod
    def no_of_trackers(self):
        """
        Number of _tracked values accross vAMM
        """
        pass

    @abstractmethod
    def _track(self, index_tracker, base, tick_lower, tick_upper):
        """
        It specifies how _tracked values need to be updated accross vAMM
        """
        pass

    # External getters
    def check_tick(self, tick):
        """
        It checks if the tick is on the vAMM
        """
        if tick < self._min_tick:
            raise Exception("vamm: tick < MIN tick")

        if tick >= self._max_tick:
            raise Exception("vamm: tick > MAX tick")

        if not tick % self._tick_spacing == 0:
            raise Exception("vamm: tick not multiple of tick spacing")

    def check_ticks(self, tick_lower, tick_upper):
        """
        It checks if the range is valid on the vAMM
        """
        if tick_lower >= tick_upper:
            raise Exception("vamm: lower tick >= upper tick")

        self.check_tick(tick=tick_lower)
        self.check_tick(tick=tick_upper)

    def closest_tick(self, tick):
        """
        It returns the closest tick on the vAMM
        """
        return math.floor(tick / self._tick_spacing + 0.5) * self._tick_spacing

    def next_crossable_tick(self, direction):
        """
        It returns the next cross tick accross the vAMM either to the left or to the right
        """
        if direction == "right":
            tick = (self._current_tick // self._tick_spacing + 1) * self._tick_spacing
            while tick < self._max_tick and tick not in self._ticks:
                tick += self._tick_spacing

            return min(tick, self._max_tick)

        if direction == "left":
            tick = (((self._current_tick - 1) // self._tick_spacing)) * self._tick_spacing
            while tick >= self._min_tick and tick not in self._ticks:
                tick -= self._tick_spacing

            return max(tick, self._min_tick)

        raise Exception("next_crossable_tick: Direction is not left or right")

    def average_base(self, base, tick_lower, tick_upper):
        """
        It returns the average base between two ticks
        """
        return base / (self.vamm_f(tick_upper) - self.vamm_f(tick_lower))

    def base_between_ticks(self, from_tick, to_tick, accumulator):
        """
        It computes the amount of base between two ticks given an accumulator
        """
        return accumulator * (self.vamm_f(to_tick) - self.vamm_f(from_tick))

    def growth_between_ticks(self, tick_lower, tick_upper):
        """
        It returns the growth values between two particular crossable ticks
        """

        self.check_ticks(tick_lower=tick_lower, tick_upper=tick_upper)

        growths = [0] * self.no_of_trackers()
        for _tracker_index in range(self.no_of_trackers()):
            if tick_lower <= self._current_tick:
                below_lower_tick = self._ticks[tick_lower]["growths"][_tracker_index]
            else:
                below_lower_tick = (
                    self._growths[_tracker_index] - self._ticks[tick_lower]["growths"][_tracker_index]
                )

            if tick_upper > self._current_tick:
                above_upper_tick = self._ticks[tick_upper]["growths"][_tracker_index]
            else:
                above_upper_tick = (
                    self._growths[_tracker_index] - self._ticks[tick_upper]["growths"][_tracker_index]
                )

            growths[_tracker_index] = self._growths[_tracker_index] - below_lower_tick - above_upper_tick

        return growths

    def tracked_values_between_ticks_outside(self, average_base, tick_lower, tick_upper):
        if not (
            tick_lower <= tick_upper <= self._current_tick or self._current_tick <= tick_lower <= tick_upper
        ):
            raise Exception("vamm: ticks are not outside")

        tmp = [0] * self.no_of_trackers()

        if tick_lower == tick_upper:
            return tmp

        base = self.base_between_ticks(from_tick=tick_lower, to_tick=tick_upper, accumulator=average_base)

        for index_tracker in range(self.no_of_trackers()):
            tmp[index_tracker] = -self._track(
                index_tracker=index_tracker, base=base, tick_lower=tick_lower, tick_upper=tick_upper
            )

        return tmp

    def tracked_values_between_ticks(self, base, tick_lower, tick_upper):
        tmp_left = [0] * self.no_of_trackers()
        tmp_right = [0] * self.no_of_trackers()

        if tick_lower == tick_upper:
            return tmp_left, tmp_right

        average_base = self.average_base(base, tick_lower, tick_upper)

        # compute unfilled tokens to left
        tmp_left = self.tracked_values_between_ticks_outside(
            average_base=average_base,
            tick_lower=min(tick_lower, self._current_tick),
            tick_upper=min(tick_upper, self._current_tick),
        )
        tmp_left = list(map(lambda x: -x, tmp_left))

        # compute unfilled tokens to right
        tmp_right = self.tracked_values_between_ticks_outside(
            average_base=average_base,
            tick_lower=max(tick_lower, self._current_tick),
            tick_upper=max(tick_upper, self._current_tick),
        )

        return tmp_left, tmp_right

    def gwap_tick(self, desired_age):
        return self.gwap_oracle.read_oracle(desired_age=desired_age)

    # Internal functions
    def __update_tick(self, tick, delta_accumulator):
        if tick not in self._ticks:
            self._ticks.update(
                {
                    tick: {
                        "average_base": 0,
                        "growths": self._growths.copy()
                        if tick <= self._current_tick
                        else [0] * self.no_of_trackers(),
                    }
                }
            )

        self._ticks[tick]["average_base"] += delta_accumulator

    def __cross_tick(self, direction):
        if direction == "right":
            self._accumulator += self._ticks[self._current_tick]["average_base"]
        elif direction == "left":
            self._accumulator -= self._ticks[self._current_tick]["average_base"]
        else:
            raise Exception("crossTick: Direction is not left or right")

        for _tracker in range(self.no_of_trackers()):
            self._ticks[self._current_tick]["growths"][_tracker] = (
                self._growths[_tracker] - self._ticks[self._current_tick]["growths"][_tracker]
            )

    def __update_global_trackers(self, delta_growths):
        for _tracker in range(self.no_of_trackers()):
            self._growths[_tracker] += delta_growths[_tracker] / self._accumulator

    def __advance_in_tick_slot(self, base_remaining, tick_limit):
        direction = "right" if base_remaining > 0 else "left"
        next_tick = self.next_crossable_tick(direction)

        reached_limit = False

        if (direction == "right" and next_tick > tick_limit) or (
            direction == "left" and next_tick <= tick_limit
        ):
            next_tick = tick_limit
            reached_limit = True

        base_in_between = self.base_between_ticks(self._current_tick, next_tick, self._accumulator)

        if abs(base_remaining) < abs(base_in_between):
            next_tick = math.floor(
                self.inv_vamm_f(base_remaining / self._accumulator + self.vamm_f(self._current_tick))
            )
            base_in_between = self.base_between_ticks(self._current_tick, next_tick, self._accumulator)
            reached_limit = True

        return next_tick, base_in_between, reached_limit

    # External functions
    def vamm_mint(self, tick_lower, tick_upper, base):
        """
        It deploys base along tick range in the vAMM
        """
        if base == 0:
            raise Exception("swap: 0 amount")

        self.check_ticks(tick_lower=tick_lower, tick_upper=tick_upper)

        average_base = self.average_base(base, tick_lower, tick_upper)

        self.__update_tick(tick=tick_lower, delta_accumulator=average_base)
        self.__update_tick(tick=tick_upper, delta_accumulator=-average_base)

        if tick_lower <= self._current_tick < tick_upper:
            self._accumulator += average_base

    def vamm_swap(self, base, tick_limit=None):
        """
        It swaps base on the vAMM.
        The direction is specified by the sign of base (position - right, negative - left).
        You can also specify a tick limit for the trade
        """
        if base == 0:
            raise Exception("swap: 0 amount")

        if tick_limit is None:
            tick_limit = self._max_tick - 1 if base > 0 else self._min_tick

        if (base > 0 and tick_limit < self._current_tick) or (base < 0 and tick_limit > self._current_tick):
            raise Exception("swap: tick limit should be worse than current tick")

        self.check_tick(tick_limit)

        advance_right = base > 0
        base_remaining = base
        _tracker_cumulatives = [0] * self.no_of_trackers()

        while not abs(base_remaining) == 0:
            if not advance_right and self._current_tick in self._ticks:
                # cross tick
                self.__cross_tick("left")

            next_tick, base_in_step, reached_limit = self.__advance_in_tick_slot(
                base_remaining=base_remaining, tick_limit=tick_limit
            )

            if abs(base_in_step) > 0:
                tmp = [0] * self.no_of_trackers()
                for index_tracker in range(self.no_of_trackers()):
                    tmp[index_tracker] = self._track(
                        index_tracker,
                        base=base_in_step,
                        tick_lower=self._current_tick,
                        tick_upper=next_tick,
                    )
                    _tracker_cumulatives[index_tracker] += tmp[index_tracker]

                self.__update_global_trackers(list(map(lambda x: -x, tmp)))

            self._current_tick = next_tick
            base_remaining -= base_in_step

            if reached_limit:
                break

            if advance_right:
                # cross tick
                self.__cross_tick("right")

        self.gwap_oracle.update_oracle(self._current_tick)

        return _tracker_cumulatives