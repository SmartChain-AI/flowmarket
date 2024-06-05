// Flow
import "/flow/config"
//import * as fcl from "@onflow/fcl"
import { block } from "@onflow/fcl"
import { Response } from 'next/server'

export default async function handler(req, res) {
  let retries = 5
  let tmpa = []
  let lastblockid = ''
  let pload2 = ''
  let count = 0

  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
  const post_data_sets = {
    "sort": "listing_timestamp",
    "order": "desc",
    "query": null,
    "limit": 10000,
    "max_mintings": {},
    "price": {},
    "weight_class": [],
    "highlight_type": [],
    "athlete_name": [],
    "tier": [],
    "set": [],
    "id": [],
  };

  const sets_requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post_data_sets),
  };

  const yo = await fetch('https://market-api.ufcstrike.com/sets/', sets_requestOptions)
  response = new Response(response.body, response);
  // Set CORS headers

  response.headers.set("Access-Control-Allow-Origin", url.origin);

  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append("Vary", "Origin");

  const done =  yo
console.info(response)


  res.status(200).json(tmpa)
}
