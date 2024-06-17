// Grabs a list of all available sets and then gets their burn info etc and pushes to DB
// initialise full list with full=1 paramenter, then set to 0 to update
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const limiter = new Bottleneck({
    maxConcurrent: 3,
    minTime: 100
  });

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";
  const url_sets = 'https://market-api.ufcstrike.com/search/sets';
  const url_sets_sales = 'https://market-api.ufcstrike.com/sets/';
  
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
      await client.connect();
      const session = client.startSession();

     /* const filterx = {
        'sales.timestamp': {
          '$gte': '2023-06-16T18:24:05Z'
        }
      };

      session.startTransaction();
      const coll = client.db('flowmarket').collection('sales');
  const cursor = coll.find(filterx);
      const result = await cursor.toArray();*/

      await getter(coll)
      
    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
      // await client.close()
    }
  }

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
          limiter.schedule(async () => await fetch(url_sets_sales + element.set_id + '/sales?sort=latest&full=1')
            .then((response) => response.json())
            .then((data) => {
              /// INSERT INTO DB ///
              const coll = client.db('flowmarket').collection('sales');
              coll.updateOne(
                { setId: data.setId },
                {
                  $set:
                  {
                    setId: data.setId,
                    ...data,
                    timestamp: date,
                  }
                },
                { upsert: true }
              )
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
