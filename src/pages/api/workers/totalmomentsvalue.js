// Calculate each day the total current floor value, past 24 hours sales value and moment amount sold

export default async function circulation(req, res) {
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const dayjs = require("dayjs");

  const uri = "mongodb+srv://doadmin:" + process.env.DB_PW + "@flowmarket-db-7c310bf1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=flowmarket-db&retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const date = new Date()
  const collection1 = client.db('flowmarket').collection('momentsets');
  const collection2 = client.db('flowmarket').collection('momentsales');

  const insertto = client.db('flowmarket').collection('dailymomentstats');
  const session = client.startSession();

  try {
    await client.connect();
    session.startTransaction();

    // Get total moments value
    const totalmomentvalue = [
      {
        $addFields: {
          convertedField: { $toInt: "$listing_price" }
        }
      },
      {
        $group: {
          _id: null,
          tmvtotal: { $sum: '$convertedField' }
        }
      }
    ];
    const tmvresult = await collection1.aggregate(totalmomentvalue).toArray();

    // Get sale count
    let startDate = dayjs().subtract(1, 'days').startOf('day').toString() 
    let endDate = dayjs().subtract(1, 'days').endOf('day').toString() 
    let newstartdate = new Date(startDate).setUTCHours(0,0,0,0)
    let newenddate = new Date(startDate).setUTCHours(23,59,59,0)
    newenddate = new Date(newenddate)
    newstartdate = new Date(newstartdate)

    const pipeline = [
      {
        $unwind: "$sales"
      },
      {
        $addFields: {
          convertedDate: { $toDate: "$sales.timestamp" }
        }
      },
      {
        $match: {
          convertedDate: { $gte: newstartdate, $lte: newenddate }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$sales.price"
          },
          count: { $sum: 1 }
        }
      },
    ];
    const result = await collection2.aggregate(pipeline).toArray();

    insertto.insertOne(
      {
        date: newstartdate,
        totalmomentsvalue: tmvresult[0].tmvtotal,
        momentsalesdaytotal: result[0].total,
        momentsalesdaycount: result[0].count,
      }
    )

  } finally {
    await session.endSession()
    res.status(200).json({ 'message': 'Done' })
  }
}
