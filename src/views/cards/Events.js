import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl';
import { block } from "@onflow/fcl"
import "../../flow/config"
import DataTableActivity from './DataTable-Activity'
import { useSettings } from 'src/@core/hooks/useSettings'
import DailySales from './DailySales'
import Grid from '@mui/material/Grid'

export default function Events() {
  const [sevnts, setSEvnts] = useState([])
  const [retrieving, setRetrieving] = useState(false)
  const { settings, saveSettings } = useSettings()

  const aurl = '/api/activity/activity/'
  const lurl = '/api/activity/listings/'
  const mdurl = '/api/activity/metadata/'
  const url_accinf = '/api/emname/';

  useEffect(() => {
    if (settings.addr) {
     // submitaddy(settings.addr)
    }
  }, [settings.loggedIn])

  useEffect(() => {

    async function getinit() {
      try {
        // GET INITIAL SALES //
        setRetrieving(true)
        const latestblock = await block({ sealed: true })
        const startblock = latestblock.height - 249
        await fetch(aurl)
          .then((res) => res.json())
          .then((data) => {
            let sresults = null
            let bresults = null
            let dresults = null
            data.forEach(async (element) => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
                await gettran(element.transaction_hash, element.fields.nftID)
                  .then(async (result) => {
                    if (element.fields.purchased) {
                      element.type = "Sold"
                      element.price = Number(result.args[result.args.length - 1].value)
                      bresults = await fetchaccinf("0x" + result.proposalKey.address)

                      if (
                        bresults.found
                        // && settings.addr
                      ) {
                        element.buyer = bresults.username + " " + "0x" + result.proposalKey.address
                      } else {
                        element.buyer = "0x" + result.proposalKey.address
                      }

                      sresults = await fetchaccinf(result.args[1].value)

                      if (sresults.found) {
                        element.seller = sresults.username + " " + result.args[1].value
                      } else {
                        element.seller = result.args[1].value
                      }

                    } else {
                      element.type = "Delisted"
                      element.price = null
                      element.buyer = null
                      dresults = await fetchaccinf("0x" + result.proposalKey.address)

                      if (
                        dresults.found
                        // && settings.addr
                      ) {
                        element.seller = dresults.username + " " + "0x" + result.proposalKey.address
                      } else {
                        element.seller = "0x" + result.proposalKey.address
                      }

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
            let lresults = null
            data.forEach(element => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
                gettran(element.transaction_hash, element.fields.nftID)
                  .then(async (result) => {
                    element.type = "Listed"
                    lresults = await fetchaccinf(element.fields.storefrontAddress)

                    if (
                      lresults.found
                      // && settings.addr
                    ) {
                      element.seller = lresults.username + " " + element.fields.storefrontAddress
                    } else {
                      element.seller = element.fields.storefrontAddress
                    }

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
              .then(async (result) => {
                let type = null
                let buyer = null
                let seller = null
                let sresults = null
                let bresults = null
                let price = null

                if (event.eventIndex !== 0) {
                  type = "Sold"
                  buyer = await fetchaccinf("0x" + result.proposalKey.address)
                  if (
                    buyer.found
                    // && settings.addr
                  ) {
                    bresults = buyer.username + " " + result.proposalKey.address
                  } else {
                    bresults = result.proposalKey.address
                  }

                  seller = await fetchaccinf(result.args[1].value)

                  if (
                    seller.found
                                        // && settings.addr
                  ) {
                    sresults = seller.username + " 0x" + result.args[1].value
                  } else {
                    sresults = "0x" + result.args[1].value
                  }

                  price = Number(result.args[result.args.length - 1].value)
                } else {
                  type = "Delisted"
                  seller = await fetchaccinf("0x" + result.proposalKey.address)

                  if (
                    seller.found
                    // && settings.addr
                  ) {
                    sresults = seller.username + " " + "0x" + result.proposalKey.address
                  } else {
                    sresults = "0x" + result.proposalKey.address
                  }
                }

                let stmparrobj = {
                  'buyer': bresults,
                  'seller': sresults,
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
          let seller = null
          let sresults = null
          console.log("checking")
          if (event.data.nftType.typeID.split('.')[2] === "UFC_NFT") {
            gettran(event.transactionId, event.data.nftID).then(async (result) => {

              seller = await fetchaccinf("0x" + result.proposalKey.address)

              if (
                seller.found
                // && settings.addr
              ) {
                sresults = seller.username + " " + "0x" + result.proposalKey.address
              } else {
                sresults = "0x" + result.proposalKey.address
              }

              let ltmparrobj = {
                'type': "Listed",
                'seller': sresults,
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

    async function fetchaccinf(userid) {
      const response = await fetch(url_accinf + '?ids=' + userid)
        .then((response) => {
          return response.json()
        }).catch(console.error);
      return response
    }

    getinit().then(subscribe())
  }, [])

  return (
    <Grid container spacing={4}>
    <Grid item xs={12} md={6} sx={{ paddingBottom: 0 }}>
      <DailySales />
    </Grid>
    <Grid item xs={12} sx={{ paddingBottom: 2 }}>
      <DataTableActivity data={sevnts} />
    </Grid>
  </Grid>
  )
}
