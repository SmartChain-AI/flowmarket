// Grabs a list of all available sets and then gets their burn info etc and pushes to DB
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";
  //"+process.env.DB_PW+"
  const url_set_circ = 'https://market-api.ufcstrike.com/sets/';
  const url_sets = 'https://market-api.ufcstrike.com/search/sets';
  
  let tmparr = []
  const date = new Date()

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
      // await client.db("flowmarket-db").command({ ping: 1 });
      // console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const filterx = {
        'sales.timestamp': {
          '$gte': '2023-06-16T18:24:05Z'
        }
      };

      session.startTransaction();
      const coll = client.db('admin').collection('FlowMarket');
      const cursor = coll.find(filterx);
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

              /// INSERT INTO DB ///
              const coll = client.db('admin').collection('FlowMarket');
              const cursor2 = coll.updateOne(
                { item: data.setId },
                {
                  $set:
                  {
                    item: data.setId,
                    timestamp: date,
                    info: data,
                  }
                },
                { upsert: true }
              )
              /*
               const cursor2 = coll.insertOne({ //_id: 375, 
                 item: data.setId,
                 timestamp: new Date(),
                 info: data
               })
              */
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
