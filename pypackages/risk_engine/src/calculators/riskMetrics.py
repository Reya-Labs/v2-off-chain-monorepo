import random
import numpy as np
from numpy import ndarray
from arch.bootstrap import CircularBlockBootstrap, optimal_block_length
from pandas import Series
from risk_engine.src.constants import Z_SCORES_DICT


class RiskMetrics:
    def __init__(self):
        pass

    @staticmethod
    def insolvency(actor_unrealized_pnl: Series, actor_margin: Series) -> Series:
        return actor_unrealized_pnl / actor_margin

    @staticmethod
    def liquidation(actor_margin: Series, actor_liquidation_margin: Series) -> Series:
        # todo: check why is unrealized pnl not captured in here, surely it should affect liquidations?
        return (actor_margin - actor_liquidation_margin) / actor_liquidation_margin

    @staticmethod
    def generate_replicates(liquidations: Series, insolvencies: Series,
                            N_replicates=100) -> tuple[list[ndarray], list[ndarray]]:
        def get_random():
            """
                Generate very small random numbers to decorate the liquidation and insolvency series with
                (necessary to avoid NaNs in the replicate generation)
            """
            exp = random.randint(-5, -2)
            significand = 0.9 * random.random() + 0.1
            return significand * 10 ** exp

        rs = np.random.RandomState(42)

        liquidations_array: ndarray = np.array([lq + get_random() for lq in liquidations])
        insolvencies_array: ndarray = np.array([i + get_random() for i in insolvencies])
        time_delta_liquidations: float = optimal_block_length(liquidations_array)["circular"].values[0]
        time_delta_insolvencies: float = optimal_block_length(insolvencies_array)["circular"].values[0]

        liquidations_bootstrap: CircularBlockBootstrap = CircularBlockBootstrap(
            block_size=int(time_delta_liquidations) + 1, x=liquidations_array, random_state=rs)
        insolvencies_bootstrap: CircularBlockBootstrap = CircularBlockBootstrap(
            block_size=int(time_delta_insolvencies) + 1, x=insolvencies_array, random_state=rs)

        liquidations_replicates: list[ndarray] = [data[1]["x"].flatten() for data in
                                                  liquidations_bootstrap.bootstrap(N_replicates)]
        insolvencies_replicates: list[ndarray] = [data[1]["x"].flatten() for data in
                                                  insolvencies_bootstrap.bootstrap(N_replicates)]

        return liquidations_replicates, insolvencies_replicates

    """
        Calculate the LVaR and IVaR according to the Gaussianity assumption for the
        underlying liquidation and insolvency distributions. Generates means and stds
        from the replicate distributions, for a given time-horizon and Z-score (based on
        singificance level, alpha)
    """

    def calculate_lvar_and_ivar(self, liquidations_replicates: list[ndarray], insolvencies_replicates: list[ndarray],
                                alpha=95) -> tuple[float, float]:
        z_score = Z_SCORES_DICT[alpha]
        liquidations_distribution: ndarray = np.array(
            [liquidation_replicate.mean() for liquidation_replicate in liquidations_replicates])
        insolvencies_distribution: ndarray = np.array(
            [insolvencies_replicate.mean() for insolvencies_replicate in insolvencies_replicates])
        liquidations_mean, insolvencies_mean = liquidations_distribution.mean(), insolvencies_distribution.mean()
        liquidations_standard_deviation, insolvencies_standard_deviation = liquidations_distribution.std(), insolvencies_distribution.std()
        liquidations_var = -z_score * liquidations_standard_deviation + liquidations_mean
        insolvencies_var = -z_score * insolvencies_standard_deviation + insolvencies_mean
        return liquidations_var, insolvencies_var
