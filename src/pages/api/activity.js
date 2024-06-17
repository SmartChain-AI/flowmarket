import "src/flow/config"
import { block } from "@onflow/fcl"

export default async function handler(req, res) {
  let lastblockid = ''

  await block({ sealed: true })
    .then((result) => {
      lastblockid = result.height
    })

  const pload = "height=" + lastblockid + "&name=A.4eb8a10cb9f87357.NFTStorefront.ListingCompleted"

  const eventlist = await fetch('https://api.findlabs.io/historical/api/rest/events?' + pload)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch(res.status(200).error)

  const done = await eventlist
  res.status(200).json(done.events)
}
