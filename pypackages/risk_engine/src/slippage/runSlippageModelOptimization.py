from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters
from pandas import Series
from sklearn.linear_model import LinearRegression
import math
import numpy as np

def run_slippage_model_optimization(
    slippage: Series,
    notional: Series
) -> SlippageModelParameters:

    '''
    Power Regression
    y=ax^(b)
    ln(y)=ln(a)+b*ln(x)

    A model of the form ln(y)=b*ln(x)+d is referred to as a log-log regression model
    it follows that any such model can be expressed as a power regression model of the form y=ax^(b)

    slippage=phi*(notional)^(beta)
    log(slippage) = log(phi) + beta * log(notional)
    '''

    log_slippage: np.ndarray = np.log(slippage.values)
    log_notional: np.ndarray = np.log(notional.values)

    linear_model = LinearRegression().fit(log_notional.reshape(-1, 1), log_slippage)
    estimated_beta: float = linear_model.coef_[0]
    estimated_phi_log: float = linear_model.intercept_
    estimated_phi: float = math.exp(estimated_phi_log)

    estimated_slippage_model_parameters: SlippageModelParameters = SlippageModelParameters(
        slippage_phi=estimated_phi,
        slippage_beta=estimated_beta
    )

    return estimated_slippage_model_parameters

