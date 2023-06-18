from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters
from pandas import Series
from sklearn.linear_model import LinearRegression
import math

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

    log_slippage = slippage.log()
    log_notional = notional.log()

    linear_model = LinearRegression().fit(log_notional, log_slippage)
    estimated_beta = linear_model.coef_
    estimated_phi_log = linear_model.intercept_
    estimated_phi = math.exp(estimated_phi_log)

    estimated_slippage_model_parameters: SlippageModelParameters = SlippageModelParameters(
        slippage_phi=estimated_phi,
        slippage_beta=estimated_beta
    )

    return estimated_slippage_model_parameters

