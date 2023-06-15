import unittest

from risk_engine.src.simulations.margin_requirements.MarginRequirements import MarginRequirements
from risk_engine.tests.end_to_end.simulations.constants import COLLATERAL_TOKEN, INITIAL_FIXED_RATE, RISK_PARAMETER, IM_MULTIPLIER, SLIPPAGE_PHI, SLIPPAGE_BETA, LP_SPREAD, IS_TRADER_VT, MAKER_FEE, TAKER_FEE, GWAP_LOOKBACK

class MarginRequirementsTest(unittest.TestCase):


    def setUp(self):
        # collateral_token,
        # initial_fixed_rate,
        # risk_parameter,
        # im_multiplier,
        # slippage_phi,
        # slippage_beta,
        # lp_spread,
        # is_trader_vt,
        # timestamps,
        # indices,
        # maker_fee,
        # taker_fee,
        # gwap_lookback

        self.margin_requirements_sim = MarginRequirements()
        self.margin_requirements_sim.setUp(
            collateral_token=COLLATERAL_TOKEN,
            initial_fixed_rate=INITIAL_FIXED_RATE,
            risk_parameter=RISK_PARAMETER,
            im_multiplier=IM_MULTIPLIER,
            slippage_phi=SLIPPAGE_PHI,
            slippage_beta=SLIPPAGE_BETA,
            lp_spread=LP_SPREAD,
            is_trader_vt=IS_TRADER_VT,
            timestamps=[0, 1]
        )

    def full_run_test(self):

        pass