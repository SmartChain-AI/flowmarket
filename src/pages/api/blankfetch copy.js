export default async function handler(req, res) {
  const url = "https://market-api.ufcstrike.com/moments/2570716"
  
  const pload = {
    "example": "Example",
   };

 const trequestOptions = {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(pload) // remove for GET
   };

  const eventlist = await fetch(url + pload, trequestOptions)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch(res.status(200).error)

  const done = await eventlist
  res.status(200).json(done.events)
}
