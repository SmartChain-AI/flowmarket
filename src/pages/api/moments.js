export default async function handler(req, res) {

  const proxyUrl = 'http://104.131.4.61:8080/';
  const url_moments = 'https://market-api.ufcstrike.com/search/moments';

  console.info(req.body)
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
    //  console.info(data)
      res.status(200).json(data)
    }).catch(console.error);

  const done = await response
}
