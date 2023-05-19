from apache_beam.io.gcp.internal.clients.bigquery import TableSchema, TableFieldSchema

def get_dated_irs_taker_positions_schema():
    table_schema = TableSchema()

    # chain_id, instrument_id, market_id, maturity_timestamp, account_id,
    # realized_pnl_from_swaps, realized_pnl_from_fees_paid, net_notional_locked,
    # net_fixed_rate_locked, timestamp, rateOracleIndex

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






