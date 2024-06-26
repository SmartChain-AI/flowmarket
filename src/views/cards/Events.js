import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl';
import { block } from "@onflow/fcl"
import "../../flow/config"
import DataTableActivity from './DataTable-Activity'

export default function Events() {
  const [sevnts, setSEvnts] = useState([])
  const [retrieving, setRetrieving] = useState(false)

  const aurl = '/api/activity/activity/'
  const lurl = '/api/activity/listings/'
  const mdurl = '/api/activity/metadata/'

  useEffect(() => {
    let stmparr = []
    let ltmparr = []

    async function getinit() {
      try {
        // GET INITIAL SALES //
        setRetrieving(true)
        const latestblock = await block({ sealed: true })
        const startblock = latestblock.height - 249
        await fetch(aurl)
          .then((res) => res.json())
          .then((data) => {
            data.forEach(async (element) => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
                await gettran(element.transaction_hash, element.fields.nftID)
                  .then((result) => {
                    if (element.fields.purchased) {
                      element.type = "Sold"
                      element.price = Number(result.args[result.args.length - 1].value)
                      element.buyer = "0x" + result.proposalKey.address
                      element.seller = result.args[1].value
                    } else {
                      element.type = "Delisted"
                      element.price = null
                      element.buyer = null
                      element.seller = "0x" + result.proposalKey.address
                    }
                    element.nftID = element.fields.nftID
                    element.serial = result.serial
                    element.edition = result.edition
                    element.editionmint = result.editionmint
                    element.storefrontAddress = element.fields.storefrontAddress
                    element.mname = result.mname
                  })
                  .finally(() => {
                    setSEvnts((sevnts) => [...sevnts, element])
                  })
              }
            })
          }).catch(console.error)

        /// GET INITIAL LISTINGS ///
        await fetch(lurl)
          .then((res) => res.json())
          .then((data) => {
            data.forEach(element => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
                gettran(element.transaction_hash, element.fields.nftID)
                  .then((result) => {
                    element.type = "Listed"
                    element.seller = element.fields.storefrontAddress
                    element.price = Number(element.fields.price)
                    element.nftID = element.fields.nftID
                    element.serial = result.serial
                    element.edition = result.edition
                    element.mname = result.mname
                    element.editionmint = result.editionmint
                  })
                  .finally(() => {
                    setSEvnts((sevnts) => [...sevnts, element])
                  })
              }
            })
          }).catch(console.error)
      } catch (error) {
        console.log('There was an error', error);
      }
      setRetrieving(false)
    }

    async function subscribe() {
      /// SALES - SUBSCRIBED ///
      try {
        fcl.events('A.4eb8a10cb9f87357.NFTStorefront.ListingCompleted').subscribe((event) => {
          if (event.data.nftType.typeID.split('.')[2] === "UFC_NFT") {
            let stmparr2 = []
            gettran(event.transactionId, event.data.nftID)
              .then((result) => {
                let type = null
                let buyer = null
                let price = null
console.info(result)
console.info(event)
                if (event.eventIndex !== 0) {
                  type = "Sold"
                  buyer = "0x" + result.proposalKey.address
                  price = Number(result.args[result.args.length - 1].value)
                } else {
                  type = "Delisted"
                  buyer = ""
                  price = null
                }

                let stmparrobj = {
                  'buyer': buyer,
                  'seller': "0x" + result.proposalKey.address,
                  'transactionId': event.transactionId,
                  'nftID': event.data.nftID,
                  'price': price,
                  'timestamp': result.timestamp,
                  'serial': result.serial,
                  'edition': result.edition,
                  'editionmint': result.editionmint,
                  'storefrontAddress': event.data.storefrontAddress,
                  'type': type,
                  'mname': result.mname
                }
                stmparr2.push(stmparrobj)
              })
              .finally(() => {
                setSEvnts((sevnts) => [...sevnts, ...stmparr2])
              })
          }
        })
      } catch (error) {
        console.log('There was a subscription error', error);
      }

      /// LISTINGS - SUBSCRIBED ///
      try {
        fcl.events('A.4eb8a10cb9f87357.NFTStorefront.ListingAvailable').subscribe((event) => {
          setRetrieving(true)
          let ltmparr2 = []
          console.log("checking")
          if (event.data.nftType.typeID.split('.')[2] === "UFC_NFT") {
            gettran(event.transactionId, event.data.nftID).then((result) => {
              let ltmparrobj = {
                'type': "Listed",
                'seller': "0x" + result.proposalKey.address,
                'transactionId': event.transactionId,
                'nftID': event.data.nftID,
                'price': Number(event.data.price),
                'timestamp': result.timestamp,
                'serial': result.serial,
                'edition': result.edition,
                'editionmint': result.editionmint,
                'storefrontAddress': event.data.storefrontAddress,
                'mname': result.mname
              }
              ltmparr2.unshift(ltmparrobj)
            }).finally(() => {
              setSEvnts((sevnts) => [...sevnts, ...ltmparr2])
            })
          }
          setRetrieving(false)
        })
      } catch (error) {
        console.log('There was a subscription error', error);
      }
    }

    /// TRANSACTION ///
    async function gettran(txid, nftid) {
      try {
        const tx = await fcl.send([fcl.getTransaction(txid,)])
          .then(fcl.decode)

        const timestamp = await block({ sealed: true })
          .then((result) => {
            return result.timestamp
          })

        const nftmd = await fetch(mdurl + '?id=' + nftid)
          .then((res) => res.json())
          .then((data) => {
            return data
          })
        console.info(nftmd)
        tx.serial = nftmd.editionNumber
        tx.edition = nftmd.setId
        tx.editionmint = nftmd.editionSize
        tx.mname = nftmd.metadata.name
        tx.timestamp = timestamp
        return tx
      } catch (error) {
        console.log('There was an error', error);
      }
    }

    getinit().then(subscribe())

  }, [])

  return (
    <DataTableActivity data={sevnts} />
  )
}
