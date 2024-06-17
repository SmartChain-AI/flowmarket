export default async function handler(req, res) {

  const url = new URL('http://localhost:3000' + req.url)

  const searchParams = new URLSearchParams(url.searchParams)
  const id = searchParams.get('id')

  const burl = `https://market-api.ufcstrike.com/sets/${id}/circulation`

  const eventlist = await fetch(burl)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch(res.status(200).error)

  const done = await eventlist
  console.info(done)
  res.status(200).json(done)
}
