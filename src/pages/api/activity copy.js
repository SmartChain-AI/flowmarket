import "src/flow/config"
import { block } from "@onflow/fcl"

export default async function handler(req, res) {
  let retries = 5
  let tmpa = []
  let lastblockid = ''
  let count = 0

  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  await block({ sealed: true })
    .then((result) => {
      lastblockid = result.height
    })

  const pload = "height=" + lastblockid + "&name=A.4eb8a10cb9f87357.NFTStorefront.ListingCompleted" // at block height, need to get latest block height

  const yo = await fetch('https://api.findlabs.io/historical/api/rest/events?' + pload)
    .then((res) => res.json())
    .then((data) => {
      return data
    }).catch(res.status(200).json({ 'error': error }))

  const done = await yo
  res.status(200).json(done.events) // done and exit

  async function yo2(pload2) {
    await sleepNow(500)

    if (count > 0) {
      await sleepNow(2000)
    }

    await fetch('https://api.findlabs.io/historical/api/rest/transaction?' + pload2)
      .then((res) => res.json())
      .then((data) => {
        if (res.status(200) && data.transactions !== undefined) {
          let arrlength = data.transactions[0]
          let amount = data.transactions[0].events[0].fields.amount
          let buyer = data.transactions[0].events[0].fields.from
          let nftid = data.transactions[0].events[1].fields.id
          let seller = data.transactions[0].events[1].fields.id
          count = 0
          return data
        } else {
          if (count > retries) {
            return
          }
          count += 1
          yo2(pload2) // retrying
        }
      }).catch(res.status(200).json({ 'error': error }))
    return
  }

  async function trannies(filteredUsers) {
    //if(filteredUsers === '*'){return }
    filteredUsers.forEach(element => { // get transactions from filtered user
      pload2 = "id=" + element.transaction_hash// at block height, need to get latest block height
     // let ev = yo2(pload2)
      tmpa.push({ 'transaction': element.transaction_hash, 'at': element.timestamp, 'event': element.event_index })
    });
  }

  const filterUsersByBH = (blockh) => {
    if (!Object.hasOwn(done, 'message')) {
      return done.events.filter(trans => trans.fields.from === blockh);
    }
    else {
      console.info(done.message)
      tmpa = { 'res': done.message }
    };
  }

  const filteredUsers = filterUsersByBH('0x9ca2ddd25b5fbd4b');
//trannies(filteredUsers)
  res.status(200).json(tmpa)
}
