// Grabs a list of all available sales and updates DB
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const limiter = new Bottleneck({
    maxConcurrent: 3,
    minTime: 100
  });

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db&retryWrites=true&w=majority";
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
      session.startTransaction();
      await getter()
      await session.endSession();
    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
      await session.abortTransaction();
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
    try {
      await fetch(url_sets, sets_requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const coll = client.db('flowmarket').collection('momentsales');
          let count = 0
          data.sets.forEach(element => {
            limiter.schedule(async () => await fetch(url_sets_sales + element.set_id + '/sales?sort=latest&full=1')
              .then((response) => response.json())
              .then(async (data) => {
                /// INSERT INTO DB ///
                const re = await coll.updateOne(
                  {
                    setId: data.setId,
                  },
                  {
                    $set:
                    {
                      setId: data.setId,
                      date: date,
                    },
                    $addToSet: {
                      sales: { $each: data.sales }
                    }
                  },
                  { upsert: true }
                )
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

    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
      await session.abortTransaction();
      await client.close()
    }
  }

  run()
    .then(
      await client.close()
    )
    .catch(
      console.dir
    );
  res.status(200).json({ 'message': 'Done' })
}
