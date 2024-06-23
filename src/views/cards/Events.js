import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl';
import { block } from "@onflow/fcl"
import "../../flow/config"
import Image from 'next/image'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

export default function Events() {
  const [sevnts, setSEvnts] = useState([])
  const [retrieving, setRetrieving] = useState(false)

  const aurl = '/api/activity/activity/'
  const lurl = '/api/activity/listings/'
  const mdurl = '/api/activity/metadata/'

  useEffect(() => {
    let stmparr = []

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
                    if (element.fields.purchased) { // if not purchased push to removed list
                      element.type = "Sold"
                      element.price = Number(result.args[result.args.length - 1].value)
                      element.buyer = "0x" + result.proposalKey.address
                      element.seller = result.args[1].value
                    } else {
                      element.type = "Removed"
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
                    stmparr.push(element)
                    //  stmparr.sort((p1, p2) => (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0)
                    setSEvnts((sevnts) => [...stmparr, sevnts])
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
                    stmparr.push(element)
                    setSEvnts((sevnts) => [...stmparr, sevnts])
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
            let stmparr = sevnts
            gettran(event.transactionId, event.data.nftID)
              .then((result) => {
                let type = null
                let buyer = null
                let price = null

                if (event.eventIndex !== 0) {
                  type = "Sold"
                  buyer = "0x" + result.proposalKey.address
                  price = Number(result.args[result.args.length - 1].value)
                } else {
                  type = "Removed"
                  buyer = ""
                  price = null
                }

                let stmparrobj = {
                  'buyer': "0x" + result.args[0].value,
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
                stmparr.unshift(stmparrobj)
              })
              .finally(() => {
                setSEvnts((sevnts) => [...stmparr, ...sevnts])
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
              stmparr.unshift(ltmparrobj)
            }).finally(() => {
              setSEvnts((sevnts) => [...stmparr, ...sevnts])
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

    getinit().then(subscribe())

  }, [])

  const columns = [
    {
      id: 'edition',
      label: '',
      minWidth: 50,
      align: 'right',
      format: value => <Image
        rel="preload"
        loading="lazy"
        quality={100}
        alt=""
        // className={'moment-image fade-in'}
        height={'45'}
        width={'45'}
        sizes="45px"
        src={"/images/moments/" + value + ".jpg"}
        sx={{ display: 'block' }}
      />
    },
    { id: 'type', label: '', minWidth: 50 },
    { id: 'mname', label: 'Name', minWidth: 200 },
    {
      id: 'price',
      label: 'Price',
      minWidth: 60,
      align: 'right',
      format: value => "$" + Number(value.toFixed(2))
    },
    { id: 'serial', label: 'Serial', minWidth: 60 },
    {
      id: 'seller',
      label: 'Owner',
      minWidth: 150,
      align: 'right',
    },
    {
      id: 'buyer',
      label: 'Buyer',
      minWidth: 150,
      align: 'right',
    },
    {
      id: 'timestamp',
      label: 'Time',
      minWidth: 120,
      align: 'right',
      sortDirection: 'desc',
      format: value => Date(value)
    }
  ]

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, fontSize: '10px' }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sevnts.map((row) => (
              <TableRow
                key={row.timestamp}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map(column => {
                  const value = row[column.id]
                  return (
                    <TableCell key={column.id} align={column.align} sx={{ fontSize: '0.9em' }}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={sevnts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
