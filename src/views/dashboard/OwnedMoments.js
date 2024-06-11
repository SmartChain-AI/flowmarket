import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Magnify from 'mdi-material-ui/Magnify'
import LoadingButton from '@mui/lab/LoadingButton';
import TotalEarning from 'src/views/dashboard/TotalEarning'
import Stack from '@mui/material/Stack';
import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";

import * as fcl from '@onflow/fcl';
import { block } from "@onflow/fcl"
import "../../flow/config"

export default function OwnedMoments(props) {

  const [dataz, setData] = useState()
  const [setsDataz, setSetData] = useState()
  const [totalz, setTotal] = useState()
  const [input, setInput] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [accnt, setAccnt] = useState();
  const [address, setAddress] = useState('')

  let azza = [];
  let lp = 0;
  let uid = 0;
  let total = 0;

  const { variant, children, ...rest } = props;
  const url_account = '/api/moments';
  const url_sets = '/api/sets';
  const url_accinf = '/api/evaluate/';

  const post_data_sets = {
    "sort": "listing_timestamp",
    "order": "desc",
    "query": null,
    "limit": 10000,
    "max_mintings": {},
    "price": {},
    "weight_class": [],
    "highlight_type": [],
    "athlete_name": [],
    "tier": [],
    "set": [],
    "id": []
  };

  const post_data_account = {
    "sort": "name",
    "order": "desc",
    "query": null,
    "limit": 10000,
    "owner": input,
  };

  const momentsOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post_data_account),
  };

  const setsOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post_data_sets),
  };

  async function fetchsets() {
    //useEffect(() => {
      const response = fetch(url_sets, setsOptions)
        .then((response) => response.json())
        .then((data) => {
          setSetData(data)
        }).catch(console.error);
 //   }, [input, isDone])
  }

  useEffect(() => {
    if (!isDataLoading) return
    const response = fetch(url_account, momentsOptions)
      .then((response) => response.json())
      .then((data) => {
        for (const moment of data.moments) {
          uid = uid + 1
          var mname = moment.name
          let found = setsDataz?.find(item => item.set_id === moment.set_id)
          if (found !== undefined) {
            lp = Number(found.listing_price)
            total = Number(found.listing_price) + total
            mname = moment.name.replace("/|/g", " ")
          }

          const heyo = receivedinf(moment.deposit_block_height)

          azza.push({
            'id': uid,
            'athlete_name': moment.metadata['ATHLETE NAME'],
            'Moment Name': mname,
            'Serial': moment.edition_number,
            'Mintage': moment.max_editions,
            'Series': moment.metadata['SERIES'],
            'Set': moment.metadata['SET'],
            'Tier': moment.metadata['TIER'],
            'Image': moment.metadata['preview'],
            'set_id': moment.set_id,
            'Image': moment.set_id,
            'Burned': moment.set_id,
            'Floor Price': lp,
            'Listed': moment.listing_price,
            'Received': moment.deposit_block_height,
            'nft_id': moment.nft_id
          })
        }
        setTotal(total)
      }).then((res) => {
        const sorted = azza.sort((p1, p2) => (p1['Floor Price'] < p2['Floor Price']) ? 1 : (p1['Floor Price'] > p2['Floor Price']) ? -1 : 0)
        setData(sorted)
        setIsDataLoading(false);
        setIsDone(true)
        localStore(input, total, sorted);
      })
      .catch(console.error);
    let counter = 0
    async function receivedinf(block_height) {
      if (counter > 0) {
        return
      }
      counter = counter + 1
      // sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
      // await sleepNow(1000)
      //console.info(block_height)

     // const events = await fcl.send([
     //   fcl.getEventsAtBlockHeightRange(
     //     'A.7e60df042a9c0868.FlowToken.TokensWithdrawn',
      //    35580624,
      //    35580624,
      //  ),
    //  ]).then(fcl.decode);

     // console.info(events)













      const yep = await fetch('https://rest-mainnet.onflow.org/v1/blocks?height=' + block_height)
        .then((results) => {
          console.info(results)
        })
      return yep
    }
  }, [setsDataz])

  async function fetchaccinf(userid) {
    const response = await fetch(url_accinf + '?ids=' + userid)
      .then((response) => {
        return response.json()
      }).catch(console.error);

    console.info(response.username)
    setAccnt({
      'im': response.avatar ?? "",
      'usname': response.username ?? ""
    })
  }

  async function getBlockH() {
    const yep = await fcl.getBlock({ 'height': '62705811' })
    console.info(yep)
  }

  async function submitaddy(value) {
    fetchsets()

    let sa = document.getElementById('address')
    if (sa.value === "" || !sa.value.startsWith("0x")) {
      return
    }
    setInput(sa.value)
    azza = []
    setIsDataLoading(true);
    setIsDone(false);
    let getlocalstore = localStorage.getItem('flowmarket')
    getlocalstore = JSON.parse(getlocalstore)
    //const fk = await getBlockH()
    fetchaccinf(sa.value)
    setAccnt()
    setTotal()

    try {
      if (getlocalstore) {
        if (getlocalstore.user.address === sa.value) {
          setAccnt({
            'im': getlocalstore.user.accava ?? "",
            'usname': getlocalstore.user.accname ?? ""
          })
        } else {
          fetchaccinf(sa.value)
        }
      } else {
        fetchaccinf(sa.value)
      }
    } catch { }
  }

  function localStore(address, totalz, allmoments) {
    let getlocalstore = localStorage.getItem('flowmarket')
    getlocalstore = JSON.parse(getlocalstore)
    if (getlocalstore) {
      if (getlocalstore.user.address === address) { // Mutating Data
        console.log('Mutating Data')
        let tmparr = getlocalstore
        tmparr.user.graphdata.date = new Date()
        tmparr.user.graphdata.total = totalz
        tmparr.user.moments = allmoments
        if (!getlocalstore.user.accname) { // Storage exists but no name
          tmparr.user.graphdata.accname = accnt.usname
        }
        if (!getlocalstore.user.accava) { // Storage exists but no avatar
          tmparr.user.graphdata.accava = accnt.im
        }
        localStorage.setItem("flowmarket", JSON.stringify(tmparr))
      } else { // Different Address
        console.log('Different Address')
        localStorage.setItem("flowmarket", JSON.stringify({
          "user": {
            "address": address,
            "graphdata": {
              "date": new Date(),
              "total": totalz
            },
            "moments": allmoments,
            "accname": accnt.usname,
            "accava": accnt.im
          }
        }
        ));
      }
    } else { // New Storage
      console.log('New Storage')

      // CHECK FOR usname AND im IN THE NEXT ONE

      localStorage.setItem("flowmarket", JSON.stringify({
        "user": {
          "address": address,
          "graphdata": {
            "date": new Date(),
            "total": totalz
          },
          "moments": allmoments,
          "accname": accnt.usname,
          "accava": accnt.im
        }
      }
      ))
    }
    return
  }


  return (
    <>
      <Card className="main-cont">
        <Box sx={{
          flexDirection: 'column',
          width: '100%',
          textAlign: 'center',
          padding: 2
        }}>
          <Box width={{
            base: '100%', // 0-48em
            md: '50%', // 48em-80em,
            // xl: '25%', // 80em+
          }}>
            <Stack spacing={[1]} direction={['row']}>
              <TextField
                size='small'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    // borderRadius: 1,
                  },
                  fontSize: '0.7em',
                }}
                id="address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Magnify fontSize='small' />
                    </InputAdornment>
                  )
                }}
                placeholder="Wallet Address"
              />
              <LoadingButton
                color="secondary"
                onClick={() => { submitaddy() }}
                loading={isDataLoading}
                variant="outlined"
                size="small"
              >Submit
              </LoadingButton>
            </Stack>
            <Box id="error-cont"></Box>
          </Box>
          <Box width={{
            base: '100%', // 0-48em
            md: '50%', // 48em-80em,
            //xl: '25%', // 80em+
          }}
            m='1'
          >
            {dataz ? (<>
              <Grid container>
                <Grid item xs={12} sm={6} md={8}>
                  <TotalEarning amount={totalz ? (<>${totalz}</>) : (<></>)}
                    accname={accnt ? accnt.usname : null} accimage={accnt ? accnt.im : null} walletid={input} />
                </Grid>
              </Grid>
            </>) : (<></>)}
          </Box>
        </Box>
      </Card>
      {!isDone ? (
        <></>
      ) : (
        <Card className="main-cont" sx={{ mt: 4 }}>
          <Box sx={{ flexDirection: 'column' }}>
            {dataz ? (<><DataTable dataz={dataz} /></>) : (<></>)}
          </Box>
        </Card>
      )
      }
    </>
  );
};

