// Grabs a list of all available sets and then gets their burn info etc
// Push to DB
import Bottleneck from "bottleneck";

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://doadmin:617ViK9vH2Y03xG8@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";
//"+process.env.DB_PW+"
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


export default async function circulation(req, res) {

  const url_set_circ = 'https://market-api.ufcstrike.com/sets/';
  const url_sets = 'https://market-api.ufcstrike.com/search/sets';
  const tmparr = []

  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 100
  });

  const post_data_sets = {
    "sort": "listing_timestamp",
    "order": "desc",
    "query": null,
    "limit": 10000,
    "max_mintings": {},
    "price": {},
    "weight_class": [],
    "highlight_type": [],
    "athlete_name": [],
    "tier": [],
    "set": [],
    "id": []
  };

  const sets_requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post_data_sets),
  };

  const getter = await fetch(url_sets, sets_requestOptions)
    .then((response) => response.json())
    .then((data) => {
      data.sets.forEach(element => {
        console.info(element)
        limiter.schedule(() => fetch(url_set_circ + element.set_id + '/circulation')
          .then((response) => response.json())
          .then((data) => {
            tmparr.push(data)
            console.log(data)
          })
          .catch(console.error)
        )
      })
    })
    .finally(() => {
      console.log('done')
      res.status(200).json(tmparr)
    })
    .catch(console.error)
}
