

def get_executed_notional_from_base(executed_base_amount: float, rate_oracle_index_at_execution_timestamp: float):
    return executed_base_amount * rate_oracle_index_at_execution_timestamp