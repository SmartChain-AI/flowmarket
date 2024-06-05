// Flow
import "../../../../flowmarket-copy/src/flow/config"
import * as fcl from "@onflow/fcl"
import { block } from "@onflow/fcl"

export default async function handler(req, res) {
  let lastblockid = ''


  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  await block({ sealed: true })
    .then((result) => {
      lastblockid = result
      console.info(lastblockid)
    })

  const { Flipside } = require("@flipsidecrypto/sdk");

  // Initialize `Flipside` with your API key
  const flipside = new Flipside(
    "fc2763b9-5d10-4343-921c-64b55bd0f716",
    "https://api-v2.flipsidecrypto.xyz"
  );
  
  const sql = `
  WITH chainwalkers AS (

    SELECT
        NULL AS streamline_transaction_id,
        tx_id,
        block_timestamp,
        block_height,
        chain_id,
        tx_index,
        proposer,
        payer,
        authorizers,
        count_authorizers,
        gas_limit,
        transaction_result,
        tx_succeeded,
        error_msg,
        _inserted_timestamp,
        NULL AS inserted_timestamp,
        NULL AS modified_timestamp
    FROM
        {{ ref('silver__transactions') }}
    WHERE
        block_height < {{ var(
            'STREAMLINE_START_BLOCK'
        ) }}
),
streamline AS (
    SELECT
        streamline_transaction_id,
        tx_id,
        block_timestamp,
        block_height,
        'flow' AS chain_id,
        NULL AS tx_index,
        proposer,
        payer,
        authorizers,
        count_authorizers,
        gas_limit,
        OBJECT_CONSTRUCT(
            'error',
            error_message,
            'events',
            events,
            'status',
            status
        ) AS transaction_result,
        tx_succeeded,
        error_message AS error_msg,
        _inserted_timestamp,
        NULL AS inserted_timestamp,
        NULL AS modified_timestamp
    FROM
        {{ ref('silver__streamline_transactions_final') }}
    WHERE
        NOT pending_result_response
        AND block_height >= {{ var(
            'STREAMLINE_START_BLOCK'
        ) }}
),
FINAL AS (
    SELECT
        *
    FROM
        chainwalkers
    UNION ALL
    SELECT
        *
    FROM
        streamline
)
SELECT
    tx_id,
    block_timestamp,
    block_height,
    chain_id,
    tx_index,
    proposer,
    payer,
    authorizers,
    count_authorizers,
    gas_limit,
    transaction_result,
    tx_succeeded,
    error_msg,
    COALESCE (
        streamline_transaction_id,
        {{ dbt_utils.generate_surrogate_key(['tx_id']) }}
    ) AS fact_transactions_id,
    COALESCE (
        inserted_timestamp,
        _inserted_timestamp
    ) AS inserted_timestamp,
    COALESCE (
        modified_timestamp,
        _inserted_timestamp
    ) AS modified_timestamp
FROM
    FINAL
  `
  
  // Send the `Query` to Flipside's query engine and await the results
  const queryResultSet = await flipside.query.run({sql: sql});


  


  res.status(200).json(queryResultSet)
}