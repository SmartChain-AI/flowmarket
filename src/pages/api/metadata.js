export default async function handler(req, res) {
  const url = "https://market-api.ufcstrike.com/moments/"
  const murl = new URL('http://localhost:3000/activity/' + req.url)
  const searchParams = new URLSearchParams(murl.searchParams)
  const id = searchParams.get('id')
//console.info(id)
  const metadata = await fetch(url+id)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch(console.error)
  const done = await metadata
  //console.info(done)
  res.status(200).json(done)
}
