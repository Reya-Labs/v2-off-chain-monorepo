import random
import numpy as np
from numpy import ndarray
from arch.bootstrap import CircularBlockBootstrap, optimal_block_length
from pandas import Series

class RiskMetrics:
    def __init__(self, z_scores: dict[float][float] = None):
        if z_scores is None:
            z_scores = {95: 1.96, 99: 2.58}
        self.z_scores = z_scores

    def insolvency(self, actor_unrealized_pnl: Series, actor_margin: Series) -> Series:
        return actor_unrealized_pnl / actor_margin

    def liquidation(self, actor_margin: Series, actor_liquidation_margin: Series) -> Series:
        # todo: check why is unrealized pnl not captured in here, surely it should affect liquidations?
        return (actor_margin - actor_liquidation_margin) / actor_liquidation_margin

    """
        Generate very small random numbers to decorate the liquidation and insolvency series with
        (necessary to avoid NaNs in the replicater generation)
    """

    @staticmethod
    def get_random():
        exp = random.randint(-5, -2)
        significand = 0.9 * random.random() + 0.1
        return significand * 10 ** exp

    def generate_replicates(self, actor_margin: Series, actor_unrealized_pnl: Series, actor_liquidation_margin: Series, N_replicates=100) -> tuple[list[ndarray], list[ndarray]]:
        rs = np.random.RandomState(42)

        liquidations = self.liquidation(actor_margin=actor_margin, actor_liquidation_margin=actor_liquidation_margin).dropna()
        insolvencies = self.insolvency(actor_unrealized_pnl=actor_unrealized_pnl, actor_margin=actor_margin)

        liquidations_array: ndarray = np.array([lq + self.get_random() for lq in liquidations])
        insolvencies_array: ndarray = np.array([i + self.get_random() for i in insolvencies])
        time_delta_liquidations: float = optimal_block_length(liquidations_array)["circular"].values[0]
        time_delta_insolvencies: float = optimal_block_length(insolvencies_array)["circular"].values[0]

        liquidations_bootstrap: CircularBlockBootstrap = CircularBlockBootstrap(block_size=int(time_delta_liquidations) + 1, x=liquidations_array, random_state=rs)
        insolvencies_bootstrap: CircularBlockBootstrap = CircularBlockBootstrap(block_size=int(time_delta_insolvencies) + 1, x=insolvencies_array, random_state=rs)

        liquidations_replicates: list[ndarray] = [data[1]["x"].flatten() for data in liquidations_bootstrap.bootstrap(N_replicates)]
        insolvencies_replicates: list[ndarray] = [data[1]["x"].flatten() for data in insolvencies_bootstrap.bootstrap(N_replicates)]

        return liquidations_replicates, insolvencies_replicates

    """
        Calculate the LVaR and IVaR according to the Gaussianity assumption for the
        underlying liquidation and insolvency distributions. Generates means and stds
        from the replicate distributions, for a given time-horizon and Z-score (based on
        singificance level, alpha)
    """

    def calculate_lvar_and_ivar(self, liquidation_replicates: list[ndarray], insolvencies_replicates: list[ndarray], alpha=95,) -> tuple[float, float]:
        z_score = self.z_scores[alpha]
        l_dist, i_dist = np.array([lr.mean() for lr in liquidation_replicates]), np.array(
            [i.mean() for i in insolvencies_replicates]
        )

        l_mu, i_mu = l_dist.mean(), i_dist.mean()
        l_sig, i_sig = l_dist.std(), i_dist.std()

        l_var = -z_score * l_sig + l_mu
        i_var = -z_score * i_sig + i_mu

        return l_var, i_var
