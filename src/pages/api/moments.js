export default async function handler(req, res) {

  const url_moments = 'https://market-api.ufcstrike.com/search/moments';

  const moments_requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  };

  const response = fetch(url_moments, moments_requestOptions)
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data)
    }).catch(console.error);

  const done = await response
}
