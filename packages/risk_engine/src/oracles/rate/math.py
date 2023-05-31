from packages.risk_engine.src.oracles.rate.rateOracle import Observation

def linear_interpolate(start: Observation, end: Observation, target_seconds_since_start) -> float:
    elapsed_proportion = target_seconds_since_start / (end.timestamp - start.timestamp)
    delta = (end.rate - start.rate) * elapsed_proportion
    return start.rate + delta


def compound_interpolate(
    start: Observation, end_not_compounded: Observation, target_seconds_since_start
) -> float:
    whole_period_factor = end_not_compounded.rate / start.rate
    simple_interest_rate_per_period = whole_period_factor - 1
    whole_period_duration = end_not_compounded.timestamp - start.timestamp
    target_factor = (1 + simple_interest_rate_per_period / whole_period_duration) ** whole_period_duration
    return start.rate * target_factor