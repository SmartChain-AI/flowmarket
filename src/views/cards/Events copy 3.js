import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl';
import { block } from "@onflow/fcl"
import "../../flow/config"
import DataTableActivity from './DataTable-Activity'
import { useSettings } from 'src/@core/hooks/useSettings'

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
      submitaddy(settings.addr)
    }
  }, [settings.loggedIn])

  useEffect(() => {
    // let stmparr = []
    // let ltmparr = []

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
                  .then(async (result) => {
                    if (element.fields.purchased) {
                      element.type = "Sold"
                      element.price = Number(result.args[result.args.length - 1].value)
                      // if (settings.addr){
                      element.buyer = await fetchaccinf("0x" + result.proposalKey.address)
                      .then((data) => {
                        if (data.found) {
                          return data.username + " " + "0x" + result.proposalKey.address
                        } else {
                          return "0x" + result.proposalKey.address
                        }
                      })
                      element.seller = await fetchaccinf(result.args[1].value)
                        .then((data) => {
                          if (data.found) {
                            return data.username + " " + result.args[1].value
                          } else {
                            return result.args[1].value
                          }
                        })
                      //    }else{
                      //     element.seller = result.args[1].value
                      //element.buyer = "0x" + result.proposalKey.address
                      //   } 
                    } else {
                      element.type = "Delisted"
                      element.price = null
                      element.buyer = null
                      // if (settings.addr){
                      element.seller = await fetchaccinf("0x" + result.proposalKey.address)
                      .then((data) => {
                        if (data.found) {
                          return data.username + " " + "0x" + result.proposalKey.address
                        } else {
                          return "0x" + result.proposalKey.address
                        }
                      })
                      //    }else{
                      //     element.seller = "0x" + result.proposalKey.address
                      //   }
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
                  .then(async (result) => {
                    element.type = "Listed"
                    //  if (settings.addr){
                    element.seller = await fetchaccinf(element.fields.storefrontAddress)
                    .then((data) => {
                      if (data.found) {
                        return data.username + " " + element.fields.storefrontAddress
                      } else {
                        return element.fields.storefrontAddress
                      }
                    })
                    //  }else{
                    //   element.seller = element.fields.storefrontAddress
                    // }
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
                let price = null
                if (event.eventIndex !== 0) {
                  type = "Sold"
                  //  if (settings.addr){
                  console.info("0x" + result.proposalKey.address)
                  buyer = await fetchaccinf("0x" + result.proposalKey.address)
                  .then((data) => {
                    if (data.found) {
                      return data.username + " " + result.proposalKey.address
                    } else {
                      return result.proposalKey.address
                    }
                  })

                  seller = await fetchaccinf(result.args[1].value)
                  .then((data) => {
                    if (data.found) {
                      return data.username + " " + result.args[1].value
                    } else {
                      return result.args[1].value
                    }
                  })
                  //  }else{
                  // buyer = "0x" + result.proposalKey.address
                  //   seller = result.args[1].value
                  // }  
                  console.info(seller)
                  price = Number(result.args[result.args.length - 1].value)
                } else {
                  type = "Delisted"
                  //   if (settings.addr){
                  seller = await fetchaccinf("0x" + result.proposalKey.address)
                  .then((data) => {
                    if (data.found) {
                      return data.username + " " + "0x" + result.proposalKey.address
                    } else {
                      return "0x" + result.proposalKey.address
                    }
                  })
                  //  }else{
                  // buyer = "0x" + result.proposalKey.address
                  //   seller = result.args[1].value
                  // }  
                }
                let stmparrobj = {
                  'buyer': buyer,
                  'seller': seller,
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
            gettran(event.transactionId, event.data.nftID).then(async (result) => {
              let seller = null
              //  if (settings.addr){
              seller = await fetchaccinf("0x" + result.proposalKey.address)
              .then((data) => {
                if (data.found) {
                  return data.username + " " + "0x" + result.proposalKey.address
                } else {
                  return "0x" + result.proposalKey.address
                }
              })
              //  }else{
              //seller = "0x" + result.proposalKey.address
              // }
              let ltmparrobj = {
                'type': "Listed",
                'seller': seller,
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
    <DataTableActivity data={sevnts} />
  )
}
