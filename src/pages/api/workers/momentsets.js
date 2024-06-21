// Grabs a list of all available sets and pushes to DB

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";
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
      await client.connect();
      const session = client.startSession();
      session.startTransaction();

      await getter()
      await session.endSession()

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
          const coll = client.db('flowmarket').collection('momentsets');
          data.sets.forEach(element => {
            const cursor2 = coll.updateOne(
              { set_id: element.set_id },
              {
                $set:
                {
                  timestamp: date,
                  ...element,
                }
              },
              { upsert: true }
            )
            return
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
  res.status(200).json(tmparr)
}
