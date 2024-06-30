// Add user to database if doesn't exist

export default async function circulation(req, res) {

  const usradd = JSON.stringify(req.body.address)
  if (!usradd) return

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

  try {
    await client.connect()
    const session = client.startSession()
    const coll = client.db('flowmarket').collection('addresses')
    const filter = { field: { $exists: false } };
    const update = {
      $setOnInsert: {
        address: usradd.replace(/"/g, ''),
        date: date
      },
    }
    const options = { upsert: true };
    session.startTransaction()
    const result = await coll.updateOne(filter, update, options)
      .then(res => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'max-age=180000');
        res.end(JSON.stringify(response))
      })
      .catch(error => {
        res.json(error);
      });

  } catch (error) {
    console.log("An error occurred during the transaction:" + error);
    await session.abortTransaction();
  }

  await client.close()
  return res.status(200).json({'message':'Done'})
}
