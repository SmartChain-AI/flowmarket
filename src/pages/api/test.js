import "src/flow/config"

/*import * as fcl from "@onflow/fcl"*/

import { block } from "@onflow/fcl"

export default async function handler(req, res) {
  let retries = 5
  let tmpa = []
  let lastblockid = ''
  let pload2 = ''
  let count = 0

  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  await block({ sealed: true })
    .then((result) => {
      lastblockid = result.height
      console.info(lastblockid)
    })

  const pload = "height=" + lastblockid + "&name=A.329feb3ab062d289.UFC_NFT.Withdraw" // at block height, need to get latest block height

  const yo = await fetch('https://api.findlabs.io/historical/api/rest/events?' + pload)
    .then((res) => res.json())
    .then((data) => {
      return data
    })

  const done = await yo

  const filterUsersByBH = (blockh) => {
    return done.events.filter(trans => trans.fields.from === blockh);
  };

  async function yo2(pload2) {
    console.log(pload2)
    await sleepNow(500)

    if (count > 0) {
      console.log("retrying attempt #"+ count)
      await sleepNow(2000)
    }
    await fetch('https://api.findlabs.io/historical/api/rest/transaction?' + pload2)
      .then((res) => res.json())
      .then((data) => {
        if (res.status(200) && data.transactions !== undefined) {
          //let arrlength = data.transactions[0].length
        //  console.log(arrlength)
       
          count = 0
          console.info("Done")
          return data
        } else {
          if (count > retries) {
            console.log("Tried 5 times but failed to get transaction, chill for a bit, the API is busy...")
            return
          }
          count += 1
          yo2(pload2) // retrying
        }
      })
    return
  }

  async function trannies(filteredUsers) {
    filteredUsers.forEach(element => { // get transactions from filtered user
      pload2 = "id=" + element.transaction_hash// at block height, need to get latest block height
      let ev = yo2(pload2)


      let amount = ev.transactions[0].events[0].fields.amount
      console.log("amount"+amount)
      let buyer = ev.transactions[0].events[0].fields.from
      console.log("buyer"+buyer)
      let nftid = ev.transactions[0].events[1].fields.id
      console.log("nftid"+nftid)
      let seller = ev.transactions[0].events[1].fields.id
      console.log("seller"+seller)


      
      tmpa.push({
        'transaction': element.transaction_hash,
        'at': element.timestamp,
        'event': element.event_index,
        'seller': ev.transactions[0].events[1].fields.id,
        'nftid': ev.transactions[0].events[1].fields.id,
        'amount': ev.transactions[0].events[0].fields.amount,
        'buyer': ev.transactions[0].events[0].fields.from,

      })

    });
  }

  const filteredUsers = filterUsersByBH('0xd3ca96e2cc6124aa');

  trannies(filteredUsers)

  res.status(200).json(tmpa)
}
