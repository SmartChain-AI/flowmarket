'use client'
import Bottleneck from "bottleneck";

export default async function handler(req, res) {

  const limiter = new Bottleneck({
    maxConcurrent: 2,
    minTime: 250
  });

  const url = "https://market-api.ufcstrike.com/moments/"
  const murl = new URL('http://localhost:3000/activity/' + req.url)
  const searchParams = new URLSearchParams(murl.searchParams)
  const id = searchParams.get('id')
  limiter.schedule(
    async () => await fetch(url + id)
    .then((res) => res.json())
    .then((data) => {
      res.status(200).json(data)
    })
    .catch(console.error)
  )
}
