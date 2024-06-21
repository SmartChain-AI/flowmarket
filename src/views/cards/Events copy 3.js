import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiDivider from '@mui/material/Divider'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl';
import { block } from "@onflow/fcl"
import "../../flow/config"
import NftInfobyid from "../../flow/scripts/nft_info_by_id"
import Image from 'next/image'

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

export default function Events() {
  const [levnts, setLEvnts] = useState([])
  const [sevnts, setSEvnts] = useState([])
  const [revnts, setREvnts] = useState([])
  const [retrieving, setRetrieving] = useState(false)

  const aurl = '/api/activity/'
  const lurl = '/api/listings/'
  const mdurl = '/api/metadata/'

  useEffect(() => {
    let ltmparr = []
    let stmparr = []
    let rtmparr = []

    async function getinit() {
      try {
        // GET INITIAL SALES //
        const latestblock = await block({ sealed: true })
        const startblock = latestblock.height - 249
        const sev = await fetch(aurl)
          .then((res) => res.json())
          .then((data) => {
            data.forEach(element => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
                gettran(element.transaction_hash, element.fields.nftID)
                  .then((result) => {
                    element.buyer = "0x" + result.proposalKey.address
                    element.seller = "0x" + result.args[0].value
                    element.price = result.args[result.args.length - 1].value
                    element.nftID = element.fields.nftID
                    element.serial = result.serial
                    element.edition = result.edition
                    element.editionmint = result.editionmint
                    element.storefrontAddress = element.fields.storefrontAddress
                  })
                  .finally(() => {
                    if (element.fields.purchased) { // if not purchased push to removed list
                      stmparr.push(element)
                    } else {
                      rtmparr.push(element)
                    }
                    stmparr.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)
                    rtmparr.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)
                    setSEvnts([...stmparr])
                    setREvnts([...rtmparr])
                  })
              }
            });
          }).catch(console.error)

        /// GET INITIAL LISTINGS ///
        const lev = await fetch(lurl)
          .then((res) => res.json())
          .then((data) => {
            data.forEach(element => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
                gettran(element.transaction_hash, element.fields.nftID)
                  .then((result) => {
                    element.seller = element.fields.storefrontAddress
                    element.price = element.fields.price
                    element.nftID = element.fields.nftID
                    element.serial = result.serial
                    element.edition = result.edition
                    element.editionmint = result.editionmint
                  })
                  .finally(() => {
                    ltmparr.push(element)
                    ltmparr.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)
                    console.info(ltmparr)
                    setLEvnts([...ltmparr])
                  })
              }
            })
          }).catch(console.error)

      } catch (error) {
        console.log('There was an error', error);
      }
    }

    async function subscribe() {
      /// SALES - SUBSCRIBED ///
      try {
        fcl.events('A.4eb8a10cb9f87357.NFTStorefront.ListingCompleted').subscribe((event) => {
          if (event.data.nftType.typeID.split('.')[2] === "UFC_NFT") {
            let stmparr = sevnts
            gettran(event.transactionId, event.data.nftID)
              .then((result) => {
                let stmparrobj = {
                  'buyer': "0x" + result.proposalKey.address,
                  'seller': result.args[0].value,
                  'transactionId': event.transactionId,
                  'nftID': event.data.nftID,
                  'price': result.args[result.args.length - 1].value,
                  'timestamp': result.timestamp,
                  'serial': result.serial,
                  'edition': result.edition,
                  'editionmint': result.editionmint,
                  'storefrontAddress': event.data.storefrontAddress
                }
                stmparr.unshift(stmparrobj)
              })
              .finally(() => {
                if (event.eventIndex !== 0) { // If not purchased push to listings
                  setSEvnts((sevnts) => [...stmparr, ...sevnts])
                } else {
                  setREvnts((revnts) => [...stmparr, ...revnts])
                }
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
          console.log("checking")
          if (event.data.nftType.typeID.split('.')[2] === "UFC_NFT") {
            let ltmparr = levnts
            const yo = gettran(event.transactionId, event.data.nftID).then((result) => {
              let ltmparrobj = {
                'seller': "0x" + result.proposalKey.address,
                'transactionId': event.transactionId,
                'nftID': event.data.nftID,
                'price': event.data.price,
                'timestamp': result.timestamp,
                'serial': result.serial,
                'edition': result.edition,
                'editionmint': result.editionmint,
                'storefrontAddress': event.data.storefrontAddress
              }
              ltmparr.unshift(ltmparrobj)
            })
            .finally(() => {
                //setLEvnts([...ltmparr])
                setLEvnts((levnts) => [...ltmparr, ...levnts])
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
        let mdarr = {}
        const tx = await fcl.send([fcl.getTransaction(txid,)])
          .then(fcl.decode)
        const timestamp = await block({ sealed: true })
          .then((result) => {
            return result.timestamp
          })
        const nftmd = await fetch(mdurl + '?id=' + nftid)
          .then((res) => res.json())
          .then((data) => {
            mdarr = {
              'serial': data.editionNumber,
              'edition': data.setId,
              'editionmint': data.editionSize,
            }
            return mdarr
          })
        tx.serial = nftmd.serial
        tx.edition = nftmd.edition
        tx.editionmint = nftmd.editionmint
        tx.timestamp = timestamp
        return tx
      } catch (error) {
        console.log('There was an error', error);
      }
    }
    getinit().then(subscribe())
  }, [])

  return (
    <Card sx={{
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: ['column', 'column', 'row']
    }}>
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Purchases'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'></Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{
          pb: theme => `${theme.spacing(5.5)} !important`,
          overflowY: 'scroll',
          maxHeight: "400px",
          height: "400px"
        }}>
          {sevnts ? (sevnts.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex', alignItems: 'center',
                  mb: index !== sevnts.length - 1 ? 6 : 0
                }}
              >
                <Box
                  sx={{
                    ml: 4,
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                    {item.edition ? (
                      <Image
                        rel="preload"
                        loading="lazy"
                        quality={100}
                        alt=""
                        className={'moment-image fade-in'}
                        height={'85'}
                        width={'85'}
                        sizes="85px"
                        src={"/images/moments/" + item.edition + ".jpg"}
                      />
                    ) : (
                      <></>
                    )}
                  </Box>
                  <Typography variant='caption'><span sx={{'color':'green'}}>#{item.serial}</span>/{item.editionmint}</Typography>
                  <Typography variant='caption'>{item.timestamp.slice(item.timestamp.lastIndexOf('T')+1).split(".", 1)[0]} {item.timestamp.split("T", 1)[0]}</Typography>
                  <Typography variant='caption'>From {item.seller} to {item.buyer}</Typography>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'success.main' }}>
                    {item.price ? "$" + Number(item.price).toFixed(2) : ""}
                  </Typography>
                </Box>
              </Box>
            )
          }
          )) : (<></>)
          }
        </CardContent>
      </Box>
      <Divider flexItem />
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Listings'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>Listings</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{
          pb: theme => `${theme.spacing(5.5)} !important`,
          overflowY: 'scroll',
          maxHeight: "400px",
          height: "400px"
        }}>
          {levnts ? (levnts.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex', alignItems: 'center',
                  mb: index !== levnts.length - 1 ? 6 : 0
                }}
              >
                <Box
                  sx={{
                    ml: 4,
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                  <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                    {item.edition ? (
                      <Image
                        rel="preload"
                        loading="lazy"
                        quality={100}
                        alt=""
                        className={'moment-image fade-in'}
                        height={'85'}
                        width={'85'}
                        sizes="85px"
                        src={"/images/moments/" + item.edition + ".jpg"}
                      />
                    ) : (<></>)}
                  </Box>
                  <Typography variant='caption'><span sx={{color:'green'}}>#{item.serial}</span>/{item.editionmint}</Typography>
                  <Typography variant='caption'>{item.timestamp.slice(item.timestamp.lastIndexOf('T')+1).split(".", 1)[0]} {item.timestamp.split("T", 1)[0]}</Typography>
                  <Typography variant='caption'>{item.seller}</Typography>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'error.main' }}>
                    {item.price ? "$" + Number(item.price).toFixed(2) : ""}
                  </Typography>
                </Box>
              </Box>
            )
          }
          )) : (<></>)
          }
        </CardContent>
      </Box>
      <Divider flexItem />
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Removed'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>Removed</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{
          pb: theme => `${theme.spacing(5.5)} !important`,
          overflowY: 'scroll',
          maxHeight: "400px",
          height: "400px"
        }}>
          {revnts ? (revnts.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex', alignItems: 'center',
                  mb: index !== revnts.length - 1 ? 6 : 0
                }}
              >
                <Box
                  sx={{
                    ml: 4,
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                  <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                    {item.edition ? (
                      <Image
                        rel="preload"
                        loading="lazy"
                        quality={100}
                        alt=""
                        className={'moment-image fade-in'}
                        height={'85'}
                        width={'85'}
                        sizes="85px"
                        src={"/images/moments/" + item.edition + ".jpg"}
                      />
                    ) : (<>
                    </>)}
                  </Box>
                  <Typography variant='caption'><span sx={{color:'green'}}>#{item.serial}</span>/{item.editionmint}</Typography>
                  <Typography variant='caption'>{item.timestamp.slice(item.timestamp.lastIndexOf('T')+1).split(".", 1)[0]} {item.timestamp.split("T", 1)[0]}</Typography>
                  <Typography variant='caption'>{item.buyer}</Typography>
                </Box>
              </Box>
            )
          }
          )) : (<></>)
          }
        </CardContent>
      </Box>
    </Card>
  )
}
