  export default async function handler(req, res) {

    const exampleusername = "0x9ca2ddd25b5fbd4b"
    const proxyUrl = 'http://104.131.4.61:8080/crz/';

    const url_dappername = 'https://graphql-api.meetdapper.com/graphql?GetPublicAccountWithAvatar';
  
    const pload = {
       "operationName": "GetPublicAccountWithAvatar",
       "variables": {
          "usernameOrFlowAddress": exampleusername
       },
       "query": "query GetPublicAccountWithAvatar($usernameOrFlowAddress: String!) {\n  getPublicAccountWithAvatar(usernameOrFlowAddress: $usernameOrFlowAddress) {\n    username\n    flowAddress\n    deactivated\n    avatar {\n      id\n      imageURL\n      name\n      __typename\n    }\n    __typename\n  }\n}",
      };
  
    const trequestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pload)
      };
  
    const response = fetch(url_dappername, trequestOptions )
      .then((response) => response.json())
      .then((data) => {
        res.status(200).json(data)
        return
      }).catch(console.error);
  
    const done = await response
  }