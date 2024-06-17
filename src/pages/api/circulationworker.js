// Grabs a list of all available sets and then gets their burn info etc
// Push to DB
import Bottleneck from "bottleneck";

export default async function circulation(req, res) {
  
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


      //await client.db("flowmarket-db").command( { serverStatus: 1 } ).metrics.apiVersions
      console.log("here");


      await client.db("flowmarket-db").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
     const session = client.startSession();
    // await getter(session)




     session.startTransaction();
     //const savingsColl = client.db("admin").collection("FlowMarket");
     //savingsColl.insertOne({ setID: 'Jane Eyre' }, { session })

     

     const test = {
      'sales.timestamp': '2023-06-16T19:24:05Z'
    };

     const filter = {
      'sales.timestamp': {
        '$gte': '2023-06-16T18:24:05Z'
      }
    };

    const coll = client.db('admin').collection('FlowMarket');
    const cursor = coll.find(filter);
    const result = await cursor.toArray();
   // coll.insert(test)
console.info(result)
    await session.endSession();
    await client.close()

    } catch (error) {
        console.log("An error occurred during the transaction:" + error);
        await session.abortTransaction();
    } finally {
       console.log("Done");
    }
    
  }

  const url_set_circ = 'https://market-api.ufcstrike.com/sets/';
  const url_sets = 'https://market-api.ufcstrike.com/search/sets';
  const tmparr = []

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

  async function getter(session) {
    await fetch(url_sets, sets_requestOptions)
      .then((response) => response.json())
      .then((data) => {







        data.sets.forEach(element => {
          //console.info(element)
          limiter.schedule(async () => await fetch(url_set_circ + element.set_id + '/circulation')
            .then((response) => response.json())
            .then((data) => {
              dbinsert(data)
          //    console.log(data)
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

  async function dbinsert(dataz) {
    
//
  }

    

  run().catch(console.dir);
  res.status(200).json(tmparr)


}
