import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Magnify from 'mdi-material-ui/Magnify'
import LoadingButton from '@mui/lab/LoadingButton';
import TotalEarning from 'src/views/dashboard/TotalEarning'
import Stack from '@mui/material/Stack';
import React, { useState, useEffect } from "react";
import DataTableValuation from "./DataTable-Valuation"
import WeeklyOverview from './WeeklyOverview'
//import * as fcl from '@onflow/fcl';
import "../../flow/config"
import { useSettings } from 'src/@core/hooks/useSettings'

const OwnedMoments = props => {

  const [dataz, setData] = useState()
  const [setsDataz, setSetData] = useState()
  const [totalz, setTotal] = useState()
  const [input, setInput] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [accnt, setAccnt] = useState();
  const { settings, saveSettings } = useSettings()

  useEffect(() => {
    if (settings.addr) {
      submitaddy(settings.addr)
    }
  }, [settings.loggedIn])

  let tmparray = [];
  let lp = 0;
  let uid = 0;
  let total = 0;

  const { variant, children, ...rest } = props;

  const url_account = '/api/dbx/umo';
  const url_accinf = '/api/emname/';
  const url_sets = '/api/dbx/sets';

  async function fetchsets(addr) {

    await fetch(url_sets)
      .then((response) => response.json())
      .then((data) => {
        setSetData(data)
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (!isDataLoading) return
    const post_data = {
      "owner": input,
    };

    const mOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post_data),
    };

    fetch(url_account, mOptions)
      .then((response) => response.json())
      .then((data) => {

        for (const moment of data.data.moments) {
          uid = uid + 1
          var mname = moment.name
          let found = data.results?.find(item => item.set_id === moment.set_id)
          if (found !== undefined) {
            lp = setsDataz?.find(item => item.set_id === moment.set_id)
            total = Number(lp.listing_price) + total
            mname = moment.name.replace("/|/g", " ")
          }

          tmparray.push({
            'id': uid,
            'athlete_name': moment.metadata['ATHLETE NAME'],
            'moment_name': mname,
            'serial': moment.edition_number,
            'mintage': moment.max_editions,
            'series': moment.metadata['SERIES'],
            'set': moment.metadata['SET'],
            'tier': moment.metadata['TIER'],
            'ipfs_image': moment.metadata['preview'],
            'set_id': moment.set_id,
            'edition_image': moment.set_id,
            'burned': found.burnedCount,
            'reserves': found.inReservesCount,
            'unopened': found.inUnopenedPackCount,
            'owned': found.ownedCount,
            'floor_price': Number(lp.listing_price),
            'listed': Number(moment.listing_price),
            'received': moment.deposit_block_height,
            'nft_id': moment.nft_id
          })
        }
        setTotal(total)
      }).then((res) => {
        const sorted = tmparray.sort((p1, p2) => (p1['Floor Price'] < p2['Floor Price']) ? 1 : (p1['Floor Price'] > p2['Floor Price']) ? -1 : 0)
        setData(sorted)
        setIsDataLoading(false);
        setIsDone(true)
        localStore(input, total, sorted);
      })
      .catch(console.error);
  }, [setsDataz])

  async function fetchaccinf(userid) {
    const response = await fetch(url_accinf + '?ids=' + userid)
      .then((response) => {
        return response.json()
      }).catch(console.error);

    setAccnt({
      'avatar': response.avatar ?? "",
      'username': response.username ?? ""
    })
    return
  }

  async function submitaddy(value) {
    let useraddr = null
    console.info(value)
    if (value) {
      if (value === "" || !value.startsWith("0x")) {
        return
      }
      useraddr = value
    } else {
      useraddr = settings.user.address
    }
    tmparray = []
    setInput(useraddr)
    fetchsets(useraddr)
    setIsDataLoading(true);
    setIsDone(false);
    fetchaccinf(useraddr)
    setAccnt()
    setTotal()
    let getlocalstore = localStorage.getItem('valuation-user-moments')
    getlocalstore = JSON.parse(getlocalstore)

    try {
      if (getlocalstore) {
        if (getlocalstore.user.address === useraddr) {
          setAccnt({
            'avatar': getlocalstore.user.accava ?? "",
            'username': getlocalstore.user.accname ?? ""
          })
        } else {
          fetchaccinf(useraddr)
        }
      } else {
        fetchaccinf(useraddr)
      }
    } catch { }
    return
  }

  function localStore(address, totalz, allmoments) {
    let getlocalstore = localStorage.getItem('valuation-user-moments')
    getlocalstore = JSON.parse(getlocalstore)
    return
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
        localStorage.setItem("valuation-user-moments", JSON.stringify(tmparr))
      } else { // Different Address
        localStorage.setItem("valuation-user-moments", JSON.stringify({
          "user": {
            "address": address,
            "graphdata": {
              "date": new Date(),
              "total": totalz
            },
            "moments": allmoments,
            "accname": accnt.username,
            "accava": accnt.avatar
          }
        }
        ));
      }
    } else { // New Storage
      console.log('New Storage')
      // CHECK FOR usname AND im IN THE NEXT ONE
      localStorage.setItem("valuation-user-moments", JSON.stringify({
        "user": {
          "address": address,
          "graphdata": {
            "date": new Date(),
            "total": totalz
          },
          "moments": allmoments,
          "accname": accnt.username,
          "accava": accnt.avatar
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
            {//<WeeklyOverview />
            }
          </Box>
          <Box width={{
            base: '100%', // 0-48em
            md: '50%', // 48em-80em,
            // xl: '25%', // 80em+
          }}>
            <Stack spacing={[1]} direction={['row']}>
              <TextField
              //  autocomplete="on" //supposed to be on form
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
                onClick={() => { submitaddy(address.value) }}
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
                    accname={accnt ? accnt.username : null} accimage={accnt ? accnt.avatar : null} walletid={input} />
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
            {dataz ? (<><DataTableValuation data={dataz} /></>) : (<></>)}
          </Box>
        </Card>
      )
      }
    </>
  );
};

export default OwnedMoments
