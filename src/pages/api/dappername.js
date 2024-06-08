export default async function handler(req, res) {

  const proxyUrl = 'http://104.131.4.61:8080/';
  const url_dappername = 'https://graphql-api.meetdapper.com/graphql?GetPublicAccountWithAvatar';

  const dappername_requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla Firefox 5.0'
    },
    body: JSON.stringify(req.body),
  };

  const response = fetch(url_dappername, dappername_requestOptions)
    .then((response) => {
      console.info(response.toString())
    //  response.json()
    })
    .then((data) => {
      console.log('test')

      console.info(data)
      res.status(200).json(data)
    }).catch(console.error);

  const done = await response
}
