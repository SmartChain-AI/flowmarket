// Grabs a list of all available sets and then gets their burn info etc and pushes to DB
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const uri = "mongodb+srv://doadmin:617ViK9vH2Y03xG8@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";
  //"+process.env.DB_PW+"
  const url_set_circ = 'https://market-api.ufcstrike.com/sets/';
  const url_sets = 'https://market-api.ufcstrike.com/search/sets';
  let tmparr = []

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
      //await client.db("flowmarket-db").command( { serverStatus: 1 } ).metrics.apiVersions
      const session = client.startSession();

      console.log("here");
      await client.db("flowmarket-db").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      session.startTransaction();

      const filterx = {
        'sales.timestamp': {
          '$gte': '2023-06-16T18:24:05Z'
        }
      };

      const coll = client.db('admin').collection('FlowMarket');
      const cursor = coll.find(filter);
      const result = await cursor.toArray();
      await getter(coll)
      await session.endSession();
    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
      await session.abortTransaction();
    } finally {
      // await client.close()
    }
  }

  const limiter = new Bottleneck({
    maxConcurrent: 2,
    minTime: 20
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

  async function getter(coll) {
    await fetch(url_sets, sets_requestOptions)
      .then((response) => response.json())
      .then((data) => {
        data.sets.forEach(element => {
          limiter.schedule(async () => await fetch(url_set_circ + element.set_id + '/circulation')
            .then((response) => response.json())
            .then((data) => {
              const coll = client.db('admin').collection('FlowMarket');
              const cursor2 = coll.insertOne({ //_id: 375, 
                item: data.setId, info: data
              })
              return
            })
            .catch(console.error)
          )
        })
        return data
      })
      .finally((data) => {
        return data
      })
      .catch(console.error)
  }

  run().catch(console.dir);
  res.status(200).json(tmparr)
}
