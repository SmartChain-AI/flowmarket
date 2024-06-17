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

  const aurl = '/api/test2/'
  const lurl = '/api/listings/'

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
console.info(data)
            data.forEach(element => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
           //   const getstuff = gettran(element.transaction_hash)
                  gettran(element.transaction_hash).then((result) => { // Get transaction details
                //  console.info(result)
                  element.buyer = "0x" + result.proposalKey.address
                  element.seller = "0x" + result.args[0].value
                  element.price = result.args[result.args.length - 1].value
                  element.nftID = element.fields.nftID
                  element.storefrontAddress = element.fields.storefrontAddress
                }).finally(() => {
                  if (element.fields.purchased) { // if not purchased push to removed list
                  stmparr.push(element)
                } else {
                  rtmparr.push(element)
                }
              //const done = await getstuff
                 stmparr.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)
              rtmparr.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)  
        setSEvnts((sevnts)=>[...sevnts, ...stmparr])
          setREvnts((revnts)=>[...revnts, ...rtmparr])
              })
   
 }

                           
            });
          //  console.info(stmparr)
           // setSEvnts((prev)=>[...prev, ...stmparr])
          //  setREvnts((prev)=>[...prev, ...rtmparr])
         
          }).catch(console.error)

        /// GET INITIAL LISTINGS ///
        const lev = await fetch(lurl)
          .then((res) => res.json())
          .then((data) => {
            console.info(data)
            data.forEach(element => {
              if (element.fields.nftType.split('.')[2] === "UFC_NFT") {
                  element.seller = element.fields.storefrontAddress
                  element.price = element.fields.price
                  element.nftID = element.fields.nftID
                ltmparr.push(element)
              }
            })
            ltmparr.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)
            setLEvnts(ltmparr)
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
            if (event.eventIndex !== 0) { // If not purchased push to listings
              console.info(event)
              gettran(event.transactionId).then((result) => { // Get transaction details
                console.info(result)
                // get timestamp from block
                // get image from nftid script
                let stmparrobj = {
                  'buyer': "0x" + result.proposalKey.address,
                  'seller': result.args[0].value,
                  'transactionId': event.transactionId,
                  'nftID': event.data.nftID,
                  'price': result.args[result.args.length - 1].value,
                  'timestamp': result.timestamptest,
                  'storefrontAddress': event.data.storefrontAddress
                }
                // const newObj = result[0] || {};
                // if (newObj.edition_number !== 'undefined') {
                //stmparr.edition_number = newObj.edition_number // Get edition number
                // }
               stmparr.unshift(stmparrobj)
                           setSEvnts((sevnts)=>[...sevnts, ...stmparr])

               // setSEvnts(stmparr)
              })
            } else {
              gettran(event.transactionId).then((result) => { // Get transaction details
                console.info(result)
                console.info(event)
                let stmparrobj = {
                  'buyer': "0x" + result.proposalKey.address,
                  'seller': result.args[0].value,
                  'transactionId': event.transactionId,
                  'nftID': event.data.nftID,
                  'price': event.data.price,
                  'timestamp': result.timestamptest,
                  'storefrontAddress': event.data.storefrontAddress
                }
                // const newObj = result[0] || {};
                // if (newObj.edition_number !== 'undefined') {
                //stmparr.edition_number = newObj.edition_number // Get edition number
                // }
                stmparr.unshift(stmparrobj)
                setREvnts(revnts => [...revnts, ...stmparr]);
              })
            }
          }
        })
      } catch (error) {
        console.log('There was a subscription error', error);
      }

      /// LISTINGS - SUBSCRIBED ///
      try {
        fcl.events('A.4eb8a10cb9f87357.NFTStorefront.ListingAvailable').subscribe((event) => {
          setRetrieving(true)
          if (event.data.nftType.typeID.split('.')[2] === "UFC_NFT") {
            let ltmparr = levnts
            console.info(event)
            const yo = gettran(event.transactionId).then((result) => { // Get transaction details
              console.info(result)
              let ltmparrobj = {
                'seller': "0x" + result.proposalKey.address,
                'transactionId': event.transactionId,
                'nftID': event.data.nftID,
                'price': event.data.price ?? "",
                'timestamp': result.timestamptest,
                'storefrontAddress': event.data.storefrontAddress
              }
              ltmparr.push(ltmparrobj)
              // const newObj = result[0] || {};
              //if (newObj.edition_number !== 'undefined') {
              // event.edition_number = newObj.edition_number
              // }
              setLEvnts(sevnts => [...sevnts, ...ltmparr])
              
            })
          }
          setRetrieving(false)
        })
      } catch (error) {
        console.log('There was a subscription error', error);
      }
    }

    async function gettran(id) {
      try {
        const tx = await fcl.send([fcl.getTransaction(id,)])
          .then(fcl.decode)
        const timestamp = await block({ sealed: true })
          .then((result) => {
            return result.timestamp
          })
          tx.timestamptest = timestamp
        return tx
      } catch (error) {
        console.log('There was an error', error);
      }
    }

    getinit().then(subscribe())
    

  }, []) // Leave array in or will loop

  //console.info(sevnts)
  //console.info(levnts)
 // console.info(revnts)
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
          action={<Typography variant='caption'>Purchases</Typography>}
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
        }}>{retrieving ? "Checking blockchain" : ""}
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
                    <Typography variant='caption'>{item.nftID}</Typography>
                  </Box>
                  <Typography variant='caption'>{item.timestamp}</Typography>
                  <Typography variant='caption'>{item.buyer}</Typography>{// .split("T", 1)[0]
                  }
                  <Typography variant='caption'>{item.seller}</Typography>
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
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {//item.fields.nftType.split('.')[2]
                      }
                    </Typography>
                  </Box>
                  <Typography variant='caption'>{item.nftID}</Typography>
                  <Typography variant='caption'>{item.timestamp}</Typography>
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
        }}>{retrieving ? "Checking blockchain" : ""}
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
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {//item.fields.nftType.split('.')[2]
                      }
                    </Typography>
                  </Box>
                  <Typography variant='caption'>{item.nftID}</Typography>
                  <Typography variant='caption'>{item.timestamp}</Typography>
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
/*  const sev = await fcl.send([
       fcl.getEventsAtBlockHeightRange(
         'A.4eb8a10cb9f87357.NFTStorefront.ListingCompleted',
         startblock,
         latestblock.height,
       ),
     ]).then(fcl.decode)
     sev.reverse()
     let tmparr = []
     sev.forEach(element => {
       if (element.data.purchased) {
         tmparr.push(element)
       } else {
         setLEvnts(levnts => [...levnts, element]);
       }
     });*/
