from elasticsearch import Elasticsearch, helpers
import pandas as pd
from ssl import create_default_context

# Create a connection to the Elasticsearch cluster and import the dataset
# Replace the Elasticsearch URL and credentials with your own
es = Elasticsearch(
    "https://localhost:9200",
    basic_auth=("elastic", 'FEuq_AMWT=bBEQ1xk+tK'), # Replace with your credentials
    # The SSL certificate is self-signed, so we disable verification. This is not recommended, but we are just communicating from localhost to localhost, so it's safe.
    # Disable SSL warnings that will trigger because we are using a self-signed certificate.
    # Alternatively, you can use the provided certificate file and fingerprint to verify the connection, but as mentioned, this trafic is local in a VM, so it's safe.
    verify_certs=False,
    ssl_show_warn=False
)

# Adjust chunk size based on your system's memory and Elasticsearch's bulk size limitations
chunkSize = 200
chunkNumber = 0

# Read the dataset in chunks and import it into Elasticsearch
for chunk in pd.read_csv("WELFake_Dataset.csv",chunksize=chunkSize):
    chunkNumber += 1
    print(f"Processing chunk {chunkNumber}...")
    print('post nr: ', chunkNumber*(chunkSize-1) + 1, ' to ', chunkNumber*(chunkSize-1) + len(chunk), ' are being processed')
    records = chunk.where(pd.notnull(chunk), None).to_dict(orient='records')
    actions = [
      {
        "_index": "post",  # Replace with your index name
        "_source": record,

      }
      for record in records
    ]

    helpers.bulk(es, actions)