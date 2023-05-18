

def get_executed_fixed_rate_from_base_and_quote(executed_base_amount: float, executed_quote_amount: float, taker_order_timestamp: int, maturity_timestamp: int):
    '''
    todo: needs implementation
    EventTimestamp
    MaturityTimestamp
    RateOracleIndex
    ExecutedBaseAmount
    ExecutedQuoteAmount

    ExecutedBaseAmount = N/LI(t)
    ExecutedQuoteAmount = -N * (1+fr_{e} * (t_{m}-t_{c})/SECONDS_IN_YEAR)

    N = ExecutedBaseAmount * LI(t)
    (-ExecutedQuoteAmount/N) = 1 + fr_{e} * (t_{m}-t_{c})/SECONDS_IN_YEAR
    (-ExecutedQuoteAmount/N) / (t_{m}-t_{c})/SECONDS_IN_YEAR = 1 + fr_{e}
    '''

    return 0.01