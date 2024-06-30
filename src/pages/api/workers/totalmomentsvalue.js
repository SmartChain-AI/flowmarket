// Calculates total floor value each day

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const date = new Date()
  const collection = client.db('flowmarket').collection('momentsets');
  const insertto = client.db('flowmarket').collection('momentstotalvalues');
  const session = client.startSession();

  try {
    await client.connect();

    session.startTransaction();

    const pipeline = [
      {
        $addFields: {
          convertedField: { $toInt: "$listing_price" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$convertedField' }
        }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();
    
    const cursor2 = insertto.insertOne(
      {
        date: date,
        total: result[0].total
      }
    )

  } finally {
    await session.endSession()
    res.status(200).json({'message':'Done'})
    // await client.close();
  }
}
