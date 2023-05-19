from apache_beam.io.gcp.internal.clients.bigquery import TableReference, TableSchema
from apache_beam.io import BigQueryDisposition
from apache_beam.io import WriteToBigQuery




def get_write_to_bigquery_transform(table_reference: TableReference, table_schema: TableSchema,
                                    write_disposition: BigQueryDisposition, create_disposition: BigQueryDisposition):

    return WriteToBigQuery(
       table=table_reference,
       schema=table_schema,
       write_disposition=write_disposition,
       create_disposition=create_disposition
    )



