// Grabs a list of all available sales and updates DB
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const limiter = new Bottleneck({
    maxConcurrent: 3,
    minTime: 100
  });

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";
  const url_moments = 'https://market-api.ufcstrike.com/search/moments';

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

  async function getter() {
    try {
      const coll = client.db('flowmarket').collection('momentinfo');
      const cursor = coll.find();
      const results = await cursor.toArray();

      const post_data_sets = {
        "owner": req.body.owner,
        "sort": "name",
        "order": "desc",
        "query": null,
        "limit": 10000
      };

      const sets_requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post_data_sets),
      };

      limiter.schedule(async () => await fetch(url_moments, sets_requestOptions)
        .then((response) => response.json())
        .then((data) => {
          let arr3 = { 'data': data, 'results': results }
          res.status(200).json(arr3)
          return data
        })
        .catch(console.error)
      )

    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
    }
  }

  run()
    .then(
      await client.close()
    )
    .catch(
      console.dir
    );
}
