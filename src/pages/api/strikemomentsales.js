export default async function handler(req, res) {
  const id = 376 // example
  const full = 0
  const url = "https://market-api.ufcstrike.com/sets/104/sales?sort=latest&full=0"

  const eventlist = await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.info(data.sales.length)
      return data
    })
    .catch(res.status(200).error)

  const done = await eventlist
  console.info(done)
  res.status(200).json(done.events)
}
