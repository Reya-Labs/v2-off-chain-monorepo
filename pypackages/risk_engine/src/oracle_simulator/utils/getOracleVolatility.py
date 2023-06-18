import numpy as np
from pandas import Series
from risk_engine.src.constants import YEAR_IN_SECONDS

def get_apy_volatility(
        apy: Series, timestamps: Series
) -> float:
    return apy.std() * np.sqrt(
        YEAR_IN_SECONDS / (timestamps.iloc[-1] - timestamps.iloc[0])
    )

