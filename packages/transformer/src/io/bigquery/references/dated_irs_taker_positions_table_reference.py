from apache_beam.io.gcp.internal.clients.bigquery import TableReference



# todo: these constants same across all, so move to a shared file in the same module (move to environment)
PROJECT_ID = 'risk-monitoring-361911'
DATASET_ID = 'voltz_v2'

def get_dated_irs_taker_positions_table_reference(table_id: str) -> TableReference:

    return TableReference(
        project_id=PROJECT_ID,
        dateset_id=DATASET_ID,
        table_id=table_id
    )