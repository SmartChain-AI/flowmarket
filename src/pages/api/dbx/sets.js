export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";


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
      await client.connect()
      const session = client.startSession()
      session.startTransaction()
      const coll = client.db('flowmarket').collection('momentsets')
      const cursor = coll.find()
      const result = await cursor.toArray()
      // .then((res)=>{
      //    res.status(200).json(result)
      //  })
      res.status(200).json(result)
      await session.endSession()
    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
      await session.abortTransaction();
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
