import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl';
import { block } from "@onflow/fcl"
import "../../flow/config"
import Image from 'next/image'
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
 
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
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


function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

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

 













  
  















































 
 
  
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelected = sevnts.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };
  
    const handleClick = (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const handleChangeDense = (event) => {
      setDense(event.target.checked);
    };
  
    const isSelected = (id) => selected.indexOf(id) !== -1;
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sevnts.length) : 0;
  
    const visibleRows = React.useMemo(
      () =>
        stableSort(sevnts, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage],
    );
  
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={sevnts.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
  
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sevnts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    );
  }
