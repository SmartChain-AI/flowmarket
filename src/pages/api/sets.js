export default async function handler(req, res) {

  const proxyUrl = 'http://104.131.4.61:8080/';
  const url_sets = 'https://market-api.ufcstrike.com/search/sets';

  const sets_requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  };

  const response = fetch(url_sets, sets_requestOptions)
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data.sets)
    }).catch(console.error);

  const done = await response
}
