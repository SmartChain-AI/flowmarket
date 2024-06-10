export default async function handler(req, res) {

  const url_dappername = 'https://api.evaluate.xyz/users/filter';
  const url = new URL('http://localhost:3000' + req.url)

  const searchParams = new URLSearchParams(url.searchParams)
  const walletid = searchParams.get('ids')

  const pload = {
    "walletAddresses": [
      walletid
    ],
    "dataProvider": 1
  };

  const trequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pload)
  };

  const response = fetch(url_dappername, trequestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.info(data.userName)
      res.status(200).json({'username':data.object[0].userName,'avatar':data.object[0].avatarPath})
      return
    }).catch(console.error);

  const done = await response
  return
}