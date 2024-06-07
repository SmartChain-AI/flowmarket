// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Magnify from 'mdi-material-ui/Magnify'

import TableBasic from 'src/views/tables/TableBasic'
import TableDense from 'src/views/tables/TableDense'
import TableSpanning from 'src/views/tables/TableSpanning'
import TableCustomized from 'src/views/tables/TableCustomized'
import TableCollapsible from 'src/views/tables/TableCollapsible'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import CardAccountFloorValue from 'src/views/cards/CardAccountFloorValue'



import React, { useState, useEffect } from "react";

import { DataTable } from "./DataTable";

//import MiniStatistics from "./MiniStatistics.js";
import * as fcl from '@onflow/fcl';
//import { block } from "@onflow/fcl"
import "../../flow/config"

export default function OwnedMoments(props) {

  // const iconBoxInside = useColorModeValue("white", "white");
  const [dataz, setData] = useState()
  const [setsDataz, setSetData] = useState()
  const [totalz, setTotal] = useState()
  const [input, setInput] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [accnt, setAccnt] = useState();

  let azza = [];
  let lp = 0;
  let uid = 0;
  let total = 0;

  const { variant, children, ...rest } = props;

  //const proxyUrl2 = 'https://sets.ufcstrike.workers.dev/x/?id=300';
  const proxyUrl = 'http://104.131.4.61:8080/';
  //const proxyUrl = '';
  
  const url_account = '/api/moments';
  const url_sets = '/api/sets';
  const url_accinf = proxyUrl + 'https://graphql-api.meetdapper.com/graphql?GetPublicAccountWithAvatar';
  //const url_accinf = 'https://daccount.ufcstrike.workers.dev/x/';

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

  const nftinf_requestOptions = {
    method: 'GET',
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
    useEffect(() => {
      const response = fetch(url_sets, setsOptions)
        .then((response) => response.json())
        .then((data) => {
          setSetData(data)
          console.info(data)
        }).catch(console.error);
    }, [input, isDone])
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

          //  const heyo = receivedinf(moment.deposit_block_height)

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
            'Listed Price': moment.listing_price,
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

    async function receivedinf(block_height) {
      const yep = await fcl.send([fcl.getBlock(), fcl.atBlockHeight(block_height)])
        .then(
          console.info(fcl.decode.block.timestamp)
        )
      return yep
    }

  }, [setsDataz])

  /*async function fetchnftinf(nftid) {
    if(!count || !dataz[0]['Moment Name']){return}
    count = count + 1
    const tarr = dataz
     dataz.forEach(element => {
     const response = fetch(url_nftinf+element.set_id+'/circulation')
    const response = await fetch(url_nftinf + nftid + '/circulation')
      .then((response) => response.json())
      .then((data) => {
         console.info(data)
        let found = dataz?.find(item => item.set_id === nftid)
         // Number(found.burnedCount)
         element.Burned = data.burnedCount
        console.info(data)
        return
      }).catch(console.error);
    return response
      });
    console.info(dataz)
  }*/

  async function fetchaccinf(userid) {
    const pload2 = { "operationName": "GetPublicAccountWithAvatar", "variables": { "usernameOrFlowAddress": "gleeful_insect7624" }, "query": "query GetPublicAccountWithAvatar($usernameOrFlowAddress: String!) {\n  getPublicAccountWithAvatar(usernameOrFlowAddress: $usernameOrFlowAddress) {\n    username\n    flowAddress\n    deactivated\n    avatar {\n      id\n      imageURL\n      name\n      __typename\n    }\n    __typename\n  }\n}" };
    const trequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Priority': 'u=1, i',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
      },
      body: JSON.stringify(pload2),
    };
    /*  const response = await fetch(url_accinf, trequestOptions)
        .then((response) => response.json())
        .then((data) => {
          setAccnt({
            'im': data.data.getPublicAccountWithAvatar.avatar.imageURL,
            'usname': data.data.getPublicAccountWithAvatar.username
          })
        }).catch(console.error);
    */
  }

  function submitaddy() {
    let erra = document.getElementById('error-cont');
    erra.innerHTML = '';
    let sa = document.getElementById('address')
    setInput(sa.value)
    azza = []
    setIsDataLoading(true);
    setIsDone(false);
    let getlocalstore = localStorage.getItem('ufcstrikefloor')
    getlocalstore = JSON.parse(getlocalstore)
    if (getlocalstore) {
      if (getlocalstore.user.address === sa.value) {
        setAccnt({
          'im': getlocalstore.user.accava,
          'usname': getlocalstore.user.accname
        })
      } else {
        fetchaccinf(sa.value)
      }
    } else {
      fetchaccinf(sa.value)
    }
  }

  function localStore(address, totalz, allmoments) {
    let getlocalstore = localStorage.getItem('ufcstrikefloor')
    getlocalstore = JSON.parse(getlocalstore)
    console.info(getlocalstore)
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
        localStorage.setItem("ufcstrikefloor", JSON.stringify(tmparr))
      } else { // Different Address
        console.log('Different Address')
        localStorage.setItem("ufcstrikefloor", JSON.stringify({
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

      localStorage.setItem("ufcstrikefloor", JSON.stringify({
        "user": {
          "address": address,
          "graphdata": {
            "date": new Date(),
            "total": totalz
          },
          "moments": allmoments,
       //   "accname": accnt.usname,
         // "accava": accnt.im
        }
      }
      ))
    }
    return
  }

  fetchsets()

  return (
    <>
      <Card 
      //maxH='100%'
       mt='1rem' className="main-cont">
        <Box sx={{ flexDirection: 'column', width: '100%' }}>
          <Box width={{
            base: '100%', // 0-48em
            md: '50%', // 48em-80em,
            xl: '25%', // 80em+
          }}>
            <TextField
              size='small'
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
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
            <Box pt='6'></Box>
            <Grid 
            align='center'>
              {isDataLoading && !isDone ? (
                <Button
                  variant='outline'
                >
                  Submit
                </Button>
              ) : (<Button
                variant='outline'
                onClick={() => { submitaddy() }}
              >
                Submit
              </Button>)
              }
            </Grid>
            <Box id="error-cont"></Box>
          </Box>
          <Box width={{
            base: '100%', // 0-48em
            md: '50%', // 48em-80em,
            //xl: '25%', // 80em+
          }}
            m='1rem'
          >
            {dataz ? (<>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <CardAccountFloorValue
                   amount={totalz ? (<>${totalz}</>) : (<></>)}
                   other={accnt}
                  />
                </Grid>
              </Grid>
            </>) : (<></>)}
          </Box>
        </Box>
      </Card>
      {!isDone ? (
        <></>
      ) : (
        <Card className="main-cont">
          <Box sx={{ flexDirection: 'column' }}>
            {dataz ? (<><DataTable dataz={dataz} /></>) : (<></>)}
          </Box>
        </Card>
      )
      }
    </>
  );
};

