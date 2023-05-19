from apache_beam.io.gcp.internal.clients.bigquery import TableSchema, TableFieldSchema

def get_dated_irs_taker_positions_schema() -> TableSchema:

    """
    timestamp, chain_id, instrument_id, market_id, maturity_timestamp, account_id,
    realized_pnl_from_swaps, realized_pnl_from_fees_paid, net_notional_locked,
    net_fixed_rate_locked, base_balance, quote_balance, rateOracleIndex
    """

    table_schema = TableSchema()

    timestamp_schema = TableFieldSchema()
    timestamp_schema.name = "timestamp"
    timestamp_schema.type = "timestamp"
    timestamp_schema.mode = "required"
    table_schema.fields.append(timestamp_schema)

    chain_id_schema = TableFieldSchema()
    chain_id_schema.name = "chain_id"
    chain_id_schema.type = "string"
    chain_id_schema.mode = "required"
    table_schema.fields.append(chain_id_schema)

    instrument_id_schema = TableFieldSchema()
    instrument_id_schema.name = "instrument_id"
    instrument_id_schema.type = "string"
    instrument_id_schema.mode = "required"
    table_schema.fields.append(instrument_id_schema)

    market_id_schema = TableFieldSchema()
    market_id_schema.name = "market_id"
    market_id_schema.type = "string"
    market_id_schema.mode = "required"
    table_schema.fields.append(market_id_schema)

    maturity_timestamp_schema = TableFieldSchema()
    maturity_timestamp_schema.name = "maturity_timestamp"
    maturity_timestamp_schema.type = "integer"
    maturity_timestamp_schema.mode = "required"
    table_schema.fields.append(maturity_timestamp_schema)

    account_id_schema = TableFieldSchema()
    account_id_schema.name = "account_id"
    account_id_schema.type = "string"
    account_id_schema.mode = "required"
    table_schema.fields.append(account_id_schema)

    realized_pnl_from_swaps_schema = TableFieldSchema()
    realized_pnl_from_swaps_schema.name = "realized_pnl_from_swaps"
    realized_pnl_from_swaps_schema.type = "numeric"
    realized_pnl_from_swaps_schema.mode = "required"
    table_schema.fields.append(realized_pnl_from_swaps_schema)

    realized_pnl_from_fees_paid_schema = TableFieldSchema()
    realized_pnl_from_fees_paid_schema.name = "realized_pnl_from_fees_paid"
    realized_pnl_from_fees_paid_schema.type = "numeric"
    realized_pnl_from_fees_paid_schema.mode = "required"
    table_schema.fields.append(realized_pnl_from_fees_paid_schema)

    net_notional_locked_schema = TableFieldSchema()
    net_notional_locked_schema.name = "net_notional_locked"
    net_notional_locked_schema.type = "numeric"
    net_notional_locked_schema.mode = "required"
    table_schema.fields.append(net_notional_locked_schema)

    net_fixed_rate_locked_schema = TableFieldSchema()
    net_fixed_rate_locked_schema.name = "net_fixed_rate_locked"
    net_fixed_rate_locked_schema.type = "numeric"
    net_fixed_rate_locked_schema.mode = "required"
    table_schema.fields.append(net_fixed_rate_locked_schema)

    base_balance_schema = TableFieldSchema()
    base_balance_schema.name = "base_balance"
    base_balance_schema.type = "numeric"
    base_balance_schema.mode = "required"
    table_schema.fields.append(base_balance_schema)

    quote_balance_schema = TableFieldSchema()
    quote_balance_schema.name = "quote_balance"
    quote_balance_schema.type = "numeric"
    quote_balance_schema.mode = "required"
    table_schema.fields.append(quote_balance_schema)

    rate_oracle_index_schema = TableFieldSchema()
    rate_oracle_index_schema.name = "rate_oracle_index"
    rate_oracle_index_schema.type = "numeric"
    rate_oracle_index_schema.mode = "required"
    table_schema.fields.append(rate_oracle_index_schema)

    return table_schema




