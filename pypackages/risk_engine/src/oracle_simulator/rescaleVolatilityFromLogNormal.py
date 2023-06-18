from pandas import Series
import numpy as np

def rescale_volatility_from_log_normal(apy: Series, scale: float) -> Series:

    log_scaled_apy: Series = apy.mul(np.random.lognormal(1, np.sqrt(scale), 1)[0])

    return log_scaled_apy