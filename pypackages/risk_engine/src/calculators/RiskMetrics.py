import random

import numpy as np
from numpy import ndarray
from arch.bootstrap import CircularBlockBootstrap, optimal_block_length
from pandas import DataFrame


class RiskMetrics:
    def __init__(self, df: DataFrame, z_scores: dict[float][float] = None):
        if z_scores is None:
            z_scores = {95: 1.96, 99: 2.58}
        self.z_scores = z_scores
        self.df = df

    # We want insolvency > 1
    def insolvency(self, actor: str) -> DataFrame:
        # todo: better name for actor (is it wallet, accountId?)
        return self.df[f"{actor}_uPnL"] / self.df[f"{actor}_margin"]

    # We want liquidation > 0
    def liquidation(self, actor: str) -> DataFrame:
        return (self.df[f"{actor}_margin"] - self.df[f"{actor}_liquidation_margin"]) / self.df[
            f"{actor}_liquidation_margin"
        ]

    """
        Generate very small random numbers to decorate the liquidation and insolvency series with
        (necessary to avoid NaNs in the replicater generation)
    """

    @staticmethod
    def get_random():
        exp = random.randint(-5, -2)
        significand = 0.9 * random.random() + 0.1
        return significand * 10 ** exp

    def generate_replicates(self, N_replicates=100) -> tuple[list[ndarray], list[ndarray]]:
        rs = np.random.RandomState(42)

        # todo: this doesn't look right
        liquidations = self.liquidation.dropna(inplace=True)
        insolvencies = self.insolvency.dropna(inplace=True)

        liq = np.array([lq + self.get_random() for lq in liquidations])
        ins = np.array([i + self.get_random() for i in insolvencies])
        # Optimal block lengths
        time_delta_l = optimal_block_length(liq)["circular"].values[0]
        time_delta_i = optimal_block_length(ins)["circular"].values[0]

        # Block bootstrapping
        l_bs = CircularBlockBootstrap(block_size=int(time_delta_l) + 1, x=liq, random_state=rs)
        i_bs = CircularBlockBootstrap(block_size=int(time_delta_i) + 1, x=ins, random_state=rs)

        l_rep = [data[1]["x"].flatten() for data in l_bs.bootstrap(N_replicates)]
        i_rep = [data[1]["x"].flatten() for data in i_bs.bootstrap(N_replicates)]

        return l_rep, i_rep

    """
        Calculate the LVaR and IVaR according to the Gaussianity assumption for the
        underlying liquidation and insolvency distributions. Generates means and stds
        from the replicate distributions, for a given time-horizon and Z-score (based on
        singificance level, alpha)
    """

    def lvar_and_ivar(self, alpha=95, l_rep=None, i_rep=None) -> tuple[float, float]:
        z_score = self.z_scores[alpha]
        if (l_rep is None) or (i_rep is None):
            l_rep, i_rep = self.generate_replicates()
        l_dist, i_dist = np.array([lr.mean() for lr in l_rep]), np.array(
            [i.mean() for i in i_rep]
        )  # CLT => Gaussian

        l_mu, i_mu = l_dist.mean(), i_dist.mean()
        l_sig, i_sig = l_dist.std(), i_dist.std()

        l_var = -z_score * l_sig + l_mu
        i_var = -z_score * i_sig + i_mu

        return l_var, i_var
