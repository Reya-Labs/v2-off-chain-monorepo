mock_position = {
    "irs_usdc": {
        "market_id": "market_irs",
        "pool_id": "pool_irs_usdc",
        "base_token": "USDC",
        "maturity": 30,
        "simulation_set": tuple([
            "apy_OracleSimulator",
            "apy_scaled_0.05_OracleSimulator",
            "apy_scaled_0.1_OracleSimulator",
            "apy_scaled_0.15_OracleSimulator",
            "apy_scaled_0.2_OracleSimulator",
            "apy_scaled_0.5_OracleSimulator",
            #"apy_scaled_0.75_OracleSimulator",
            #"apy_scaled_1_OracleSimulator",
            #"apy_shock_OracleSimulator",
        ]),
        "maker_amount": 10000,
        "taker_amount": 1000,
        "phi": 2e-5,
        "beta": 1.02
    }
}