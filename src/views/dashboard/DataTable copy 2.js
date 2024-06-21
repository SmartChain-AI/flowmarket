import * as React from 'react'
import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnResizeMode,
  ColumnResizeDirection,
} from '@tanstack/react-table'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import Select from '@mui/material/Select'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableFooter from '@mui/material/TableFooter'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import ArrowDownBoldCircle from 'mdi-material-ui/ArrowDownBoldCircle'
import ArrowUpBoldCircle from 'mdi-material-ui/ArrowUpBoldCircle'
import TableCog from 'mdi-material-ui/TableCog'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import LinkBoxVariant from 'mdi-material-ui/LinkBoxVariant';
import Image from 'next/image'

export default function DataTable({ dataz }) {

  if (!dataz) return

  const [data, setData] = React.useState(dataz)
  const columnHelper = createColumnHelper()
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnOrder, setColumnOrder] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [columnResizeMode, setColumnResizeMode] = React.useState('onChange')
  const [columnResizeDirection, setColumnResizeDirection] = React.useState('ltr')
  const rerender = React.useReducer(() => ({}), {})[1]
  let count = 0;
  /*
    async function burned(setid){
      let tk = 0;
      const token = await fetch(url_nftinf+setid+'/circulation')// getting calls for the same editions in a collection.  eg my alex volkanovskis call this 12 times. unnecessary
      .then((response) => response.json())
      .then((data) => {
        tk = data
      }).catch(console.error);
  console.info(tk)
    }
  */
  const defaultColumns = [
    columnHelper.accessor('Image', {
      cell: info => <div sx={{ position: 'relative' }}>
        <Image
          rel="preload"
          loading="lazy"
          quality={100}
          alt={info.getValue()}
          className={'moment-image fade-in'}
          height={'85'}
          width={'85'}
          sizes="85px"
          src={"/images/moments/" + info.getValue() + ".jpg"}
          />
      </div>,
      header: () => '',
      enableResizing: false,
      size: 85,
    }),
    columnHelper.accessor('Moment Name', {
      cell: info => <div className="moment-name" >
        {info.getValue()} 
      </div>,
      header: () => 'Moment',
      size: 200,
      enableResizing: true,
    }),
    columnHelper.accessor('Floor Price', {
      header: 'Floor',
      // id: 'floor',
      cell: info => '$' + info.renderValue(),
      size: 50,
    }),
    columnHelper.accessor('Serial', {
      header: () => 'Serial',
      size: 100,
    }),
    columnHelper.accessor('Mintage', {
      header: () => 'Mintage',
      size: 100,
    }),
    columnHelper.accessor('Series', {
      header: 'Series',
      cell: info => info.renderValue(),
    }),
    columnHelper.accessor('Tier', {
      header: 'Tier',
      cell: info => info.renderValue(),
    }),
    columnHelper.accessor('Set', {
      header: 'Set',
      cell: info => info.renderValue(),
    }),
    columnHelper.accessor('Listed', {
      header: 'Listed Price',
      cell: info => info.renderValue() ? '$' + info.renderValue() : 'N/A',
    }),
     columnHelper.accessor('Burned', {
      header: 'Burned',
      cell: info => <>{info.renderValue()}</>,
     }),
    // columnHelper.accessor('Received', {
    //   header: 'Received',
    //   cell: info => info.getValue(),
    //  })
  ]

  const [columns] = React.useState(() => [...defaultColumns])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
      sorting,
      pagination,
      columnResizeMode,
    columnResizeDirection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

  })
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
  return (
    <TableContainer className="table-cont" sx={{
      'width': 'inherit',
      m: 4
    }}>
      <Box sx={{
        width: '100%',
        display: 'flex',
        // justifyContent: 'space-between',
        justifyContent: "flex-end"
      }}>
        <Accordion
          allowtoggle="true"
          sx={{
            'maxWidth': 'max-content',
            'textAlign': 'left',
            'display': 'inline-block'
          }}
        >
          <AccordionSummary>
            <TableCog />
          </AccordionSummary>
          <AccordionDetails pb={4}>
            <Box className="inline-block border border-black shadow rounded">
              <Box className="px-1 border-b border-black">
                <Stack spacing={[1, 5]} direction={['column', 'column']}>
                  {table.getAllLeafColumns().map(column => {
                    return (
                      <Box key={column.id} className="px-1">
                        <Checkbox size='medium'
                          {...{
                            type: 'checkbox',
                            checked: column.getIsVisible(),
                            onChange: column.getToggleVisibilityHandler(),
                          }}
                        />{' '}
                        {column.id}
                      </Box >
                    )
                  })}
                </Stack>
              </Box >
            </Box >
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        <Table stickyHeader aria-label='sticky table'
          className="OwnedMomentsTable"
          sx={{ marginTop: 4 }}
        >
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan} className="prevent-select">
                    {header.isPlaceholder ? null : (
                      <Box className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowDownBoldCircle className="sortdesc" />,
                          desc: <ArrowUpBoldCircle className="sortasc" />,
                        }[header.column.getIsSorted()] ?? null}
                      </Box>
                    )}
                  </th>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map(footerGroup => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                  </th>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
        <Box className="flex items-center" sx={{
          'textAlign': 'center',
          'display': 'inline-block',
          'fontSize': '0.7em',
          'justifyContent': 'center',
          'width': '100%'
        }}>
          <Button
            className="border rounded"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            className="border rounded"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            className="border rounded"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            className="border rounded"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>Page&nbsp;
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </Box >
          <Select sx={{
            'fontSize': '1em',
            marginTop: 2,
            p: 0
          }}
            value={table.getState().pagination.pageSize}
          >
            {[10, 25, 50, 100, 500].map(pageSize => (
              <MenuItem key={pageSize} value={pageSize} onClick={() => { table.setPageSize(Number(pageSize)) }}>
                Show {pageSize}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </TableContainer>
  )
}
