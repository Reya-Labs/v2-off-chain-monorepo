import unittest

from risk_engine.src.simulations.margin_requirements.MarginRequirements import MarginRequirements

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

        self.margin_requirements_sim = MarginRequirements(

        )

    def full_run_test(self):

        pass