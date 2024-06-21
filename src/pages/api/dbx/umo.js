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

      // data.sets.forEach(element => {
      limiter.schedule(async () => await fetch(url_moments, sets_requestOptions)
        .then((response) => response.json())
        .then((data) => {
          //  console.info(data)
          //   const mergeById = (a1, a2) =>
          //    a1.map(itm => ({
          //       ...a2.find((item) => (item.id === itm.id) && item),
          //       ...itm
          //   }));
          let arr3 = { 'data': data, 'results': results }
          //    console.log(mergeById(result,data));
          //  var newArray = data.sets.map(x=>Object.assign(x, result.find(y=>y.set_id==x.set_id)))
          // console.info(arr3)

          res.status(200).json(arr3)

          /// INSERT INTO DB ///
          /*   coll.updateOne(////// FIX ALL THIS
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
              
             )*/
          return data
        })
        .catch(console.error)
      )
      //  })
      //return data

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
  //res.status(200).json(tmparr)
}
