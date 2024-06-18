// Grabs a list of all available sets and then gets their burn info etc and pushes to DB
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";
  const url_set_circ = 'https://market-api.ufcstrike.com/sets/';
  const url_sets = 'https://market-api.ufcstrike.com/search/sets';

  const limiter = new Bottleneck({
    maxConcurrent: 3,
    minTime: 100
  });

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
      session.startTransaction();

      await getter()
      await session.endSession()
      //await client.close()

    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
      await session.abortTransaction();
    } finally {
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

  async function getter() {
    await fetch(url_sets, sets_requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const coll = client.db('flowmarket').collection('momentinfo');
        data.sets.forEach(element => {
          limiter.schedule(async () => await fetch(url_set_circ + element.set_id + '/circulation')
            .then((response) => response.json())
            .then((data) => {
              /// INSERT INTO DB ///
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

  run()
    .then(
      await client.close()
    )
    .catch(
      console.dir
    );
  res.status(200).json(tmparr)
}
