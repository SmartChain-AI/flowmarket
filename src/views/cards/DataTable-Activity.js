import { useMemo, useState, useRef } from 'react';
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
import { Suspense } from 'react';

const DataTableActivity = ({ data }) => {

  //const isMobile = useMediaQuery('(max-width: 1000px)');
  const isFirstRender = useRef(true);

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  //const [density, setDensity] = useState({});
  const [globalFilter, setGlobalFilter] = useState(undefined);
  const [showGlobalFilter, setShowGlobalFilter] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnPinning, setColumnPinning] = useState([]);
  //const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });


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
    state:{ 
      isLoading: data.length ? false:true
    },
    muiCircularProgressProps:{
      color: 'secondary',
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps:{
      animation: 'pulse',
      height: 28,
    },
    //onPaginationChange: setPagination,
    //onDensityChange:setDensity,
    muiPaginationProps: {
      showRowsPerPage: true,
      shape: 'rounded',
    },
    enableStickyHeader: true,
    enableColumnOrdering: true,
    muiTableContainerProps: { sx: { maxHeight: '500px' } },
   // density,
  //  pagination,
    // columnFilterDisplayMode: 'custom',
    // muiFilterTextFieldProps: ({ column }) => ({
    //    label: `Filter by ${column.columnDef.header}`,
    // }),
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
