import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_TableFooter,
  MRT_TableContainer,
  MRT_TableHeadCellFilterContainer,
} from 'material-react-table';
import { Paper, Stack, useMediaQuery } from '@mui/material';
import Image from 'next/image'
import Box from '@mui/material/Box'

const DataTableActivity = ({ data }) => {

  if (!data) { return }

  //const isMobile = useMediaQuery('(max-width: 1000px)');
  const [pagination, setPagination] = useState({})
  const [density, setDensity] = useState({})

  const columns = useMemo(
    () => [
      {
        accessorKey: 'edition',
        header: '',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ renderedCellValue, row }) => (
          renderedCellValue ? (
      
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <a href={"https://ufcstrike.com/v2/moment/" + row.original.nftID} target="_blank">
                <Image
                  rel="preload"
                  loading="lazy"
                  quality={100}
                  alt={row.original.mname}
                  className={'moment-image fade-in'}
                  height={'85'}
                  width={'85'}
                  sizes="85px"
                  src={`/images/moments/${renderedCellValue}.jpg`}
                />
              </a>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
            </Box>
          )
        ),
      },
      {
        accessorKey: 'type',
        header: '',
        enableSorting: false,
        filterFn: 'equals',
        filterSelectOptions: ['Sold', 'Listed', 'Delisted'],
        filterVariant: 'select',
      },
      {
        accessorKey: 'mname',
        header: 'Moment Name',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        filterVariant: 'range',
        Cell: ({ renderedCellValue, row }) => (
          renderedCellValue ? (
            <>{"$" + renderedCellValue}</>
          ) : (
            <></>
          )
        )
      },
      {
        accessorKey: 'serial',
        header: 'Serial',
      },
      {
        accessorKey: 'seller',
        header: 'Seller',
      },
      {
        accessorKey: 'buyer',
        header: 'Buyer',
      },
      {
        accessorKey: 'timestamp',
        header: 'Time',
        Cell: ({ renderedCellValue, row }) => (
          new Date(renderedCellValue).toLocaleString()
        )
      },
    ],
    [],
  );
//{table.getState().density !== 'compact' ? '85':'15'}
  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: 'timestamp',
          desc: true,
        }
      ],
    },
    state: {
   //   pagination
    },
    onPaginationChange: setPagination,
    onDensityChange:setDensity,
    muiPaginationProps: {
      showRowsPerPage: true,
      shape: 'rounded',
    },
    enableStickyHeader: true,
    muiTableContainerProps: { sx: { maxHeight: '500px' } },
    // columnFilterDisplayMode: 'custom',
    // muiFilterTextFieldProps: ({ column }) => ({
    //    label: `Filter by ${column.columnDef.header}`,
    // }),
    enableColumnOrdering: true,

  });

  return (
    <Stack
  //    direction={
  //      isMobile ? 'column-reverse' : 'row'
 //     }
      gap="8px"
    >
      <MaterialReactTable
       table={table} 
       />
    </Stack>
  );
};

export default DataTableActivity;
