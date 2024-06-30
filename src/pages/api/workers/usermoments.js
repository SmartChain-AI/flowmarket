// Grabs a list of all available sales and updates DB
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const limiter = new Bottleneck({
    maxConcurrent: 3,
    minTime: 100
  });

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db&retryWrites=true&w=majority";
  const url_moments = 'https://market-api.ufcstrike.com/search/moments';

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

  async function getter() {
    try {
      let data = [{ 'address': '0x9ca2ddd25b5fbd4b' }]

      const post_data_sets = {
        "sort": "deposit_block_height",
        "order": "desc",
        "query": null,
        "limit": 10000,
        "owner": data.address
      };

      const sets_requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post_data_sets),
      };

      const coll = client.db('flowmarket').collection('usermoments');
      data.sets.forEach(element => {
        limiter.schedule(async () => await fetch(url_moments, sets_requestOptions)
          .then((response) => response.json())
          .then((data) => {
            /// INSERT INTO DB ///
            coll.updateOne(
              { address: data.address },
              {
                $set:
                {
                  address: data.address,
                  ...data,
                  timestamp: date,
                },
              },
              // { $addToSet: { sales: data.sales } },
              // { upsert: true }
            )
            return
          })
          .catch(console.error)
        )
      })
      return data

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
