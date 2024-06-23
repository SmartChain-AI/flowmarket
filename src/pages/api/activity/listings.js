'use client'
import "src/flow/config"
import { block } from "@onflow/fcl"
import Bottleneck from "bottleneck";

export default async function handler(req, res) {

  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 500
  });

  let lastblockid = ''

  await block({ sealed: true })
    .then((result) => {
      lastblockid = result.height
    })

  const pload = "height=" + lastblockid + "&name=A.4eb8a10cb9f87357.NFTStorefront.ListingAvailable"

  const eventlist =  limiter.schedule(async () => await fetch('https://api.findlabs.io/historical/api/rest/events?' + pload)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch(res.status(200).error)
  )

  const done = await eventlist
  const sorted = done.events.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)

  res.status(200).json(sorted)
}
