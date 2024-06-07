import * as React from 'react'

import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export function DataTable({ dataz }) {

  if (!dataz[0]['Moment Name']) return

  const [data, setData] = React.useState(dataz)
  const columnHelper = createColumnHelper()
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnOrder, setColumnOrder] = React.useState([])
  const [sorting, setSorting] = React.useState([])

  const url_nftinf = 'https://market-api.ufcstrike.com/sets/';
  let count = 0;

  async function burned(setid){
    let tk = 0;
    const token = await fetch(url_nftinf+setid+'/circulation')// getting calls for the same editions in a collection.  eg my alex volkanovskis call this 12 times. unnecessary
    .then((response) => response.json())
    .then((data) => {
      tk = data
    }).catch(console.error);
console.info(tk)
  }

  const defaultColumns = [
    columnHelper.accessor('Image', {
      cell: info => <img
        rel="preload"
        loading="lazy"
        alt={info.getValue()}
        className={'moment-image'}
        height={'85'}
        width={'85'}
        transition={{ enter: { duration: 2.5 } }}
        src={"/images/moments/" + info.getValue() + ".jpg"} />,
      header: () => '',
      enableResizing: false,
      size: 85, //starting column size
    }),
    columnHelper.accessor('Moment Name', {
      cell: info => <div className="moment-name">{info.getValue()}</div>,
      header: () => 'Moment',
      size: 200,
      enableResizing: true,
    }),
    columnHelper.accessor('Floor Price', {
      header: 'Floor',
      id: 'floor',
      cell: info => '$' + info.renderValue(),
    }),
    columnHelper.accessor('Serial', {
      header: () => 'Serial',
    }),
    columnHelper.accessor('Mintage', {
      header: () => 'Mintage',
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
    columnHelper.accessor('Listed Price', {
      header: 'Listed Price',
      cell: info => info.renderValue() ? '$' + Number(info.renderValue()) : null,
    }),
   // columnHelper.accessor('Burned', {
    //  header: 'Burned',
    //  cell: info => <>{burned(info.getValue())}</>,
   // }),
   // columnHelper.accessor('Received', {
   //   header: 'Received',
   //   cell: info => info.getValue(),
   // })
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

  return (
    <Box className="table-cont" sx={{
      'width': 'inherit'
    }}>
      <Box sx={{
        'width': '100%',
        'display': 'flex',
        'justify-content': 'space-between',
      }}>
       {/*
        <Accordion allowToggle sx={{
          'maxWidth': 'max-content',
          'textAlign': 'left',
          'display': 'inline-block'
        }}>
          <AccordionItem>
            <h2>
              <AccordionButton sx={{
                'borderRadius': '15px'
              }}>
                <Box as='span' textAlign='left'>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box className="inline-block border border-black shadow rounded">
                <Box className="px-1 border-b border-black">
                  <Stack spacing={[1, 5]} direction={['column', 'row']}>
                    {table.getAllLeafColumns().map(column => {
                      return (
                        <Box key={column.id} className="px-1">
                          <Checkbox size='md' colorScheme='green' defaultChecked
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        */}
      </Box>
      <Box>
        <table variant='simple' size='lg' style={{ fontSize: '0.7em' }} className="dragscroll">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
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
                       //   asc: <ArrowUpIcon />,
                     //     desc: <ArrowDownIcon />,
                        }[header.column.getIsSorted()] ?? null}
                      </Box>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
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
              </tr>
            ))}
          </tfoot>
        </table>
        <Box className="flex items-center" sx={{
          'maxWidth': 'max-content',
          'textAlign': 'right',
          'display': 'inline-block',
          'fontSize': '0.7em'
        }}>
          <Button
            className="border rounded"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            className="border rounded" marginLeft='1'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            className="border rounded" marginLeft='1'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            className="border rounded" marginLeft='1'
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
          <Box margin='1'>Page&nbsp;
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </Box >
          {/*
          <Select sx={{
            'fontSize': '1em'
          }}
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 25, 50, 100, 500].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          */}
        </Box>
      </Box>
    </Box>
  )
}
