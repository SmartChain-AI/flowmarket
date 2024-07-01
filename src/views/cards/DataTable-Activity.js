import { useMemo, useState, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
 MRT_ToggleDensePaddingButton,
 MRT_ToggleFullScreenButton,
} from 'material-react-table';
import { Paper, Stack, useMediaQuery } from '@mui/material';
import Image from 'next/image'
import Box from '@mui/material/Box'
import { Button, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const DataTableActivity = ({ data }) => {
//data=[]
  //const isMobile = useMediaQuery('(max-width: 1000px)');
  const isFirstRender = useRef(true);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState(undefined);
  const [showGlobalFilter, setShowGlobalFilter] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnPinning, setColumnPinning] = useState([]);
  //const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [density, setDensity] = useState({});
  const imgsize = {
    'sm':'25',
    'md':'65',
    'lg':'120'
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'edition',
        header: '',
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: 'center',
          sx: {
            ms: '10px',
          }
        },
        muiTableBodyCellProps: { 
          align: 'center',
         },
        grow: false,
        size: density === 'compact' ? '30px': density === 'comfortable' ? '60px' : '90px',
        Cell: ({ renderedCellValue, row }) => (
          renderedCellValue ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                //gap: '1rem',
              }}
            >
              <a href={"https://ufcstrike.com/v2/moment/" + row.original.nftID} target="_blank">
                <Image
                  rel="preload"
                  loading="lazy"
                  quality={100}
                  alt={table.getState().density}
                  className={'moment-image fade-in'}
                  height={table.getState().density === 'compact' ? imgsize.sm: table.getState().density === 'comfortable' ? imgsize.md : imgsize.lg}
                  width={table.getState().density === 'compact' ? imgsize.sm: table.getState().density === 'comfortable' ? imgsize.md : imgsize.lg}
                  sizes={table.getState().density === 'compact' ? imgsize.sm: table.getState().density === 'comfortable' ? imgsize.md : imgsize.lg}
                  style={{
                    objectFit: "contain",
                    borderRadius: "5px"
                  }}
                  sx={{
                    borderRadius: table.getState().density === 'compact' ? '5px':'15px'
                  }}
                  //sizes="85px"
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
  //{table.getState().density !== 'comfortable' ? '85':'15'}
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
      isLoading: data.length ? false : true
    },
    muiCircularProgressProps: {
      color: 'secondary',
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    columnFilterDisplayMode: 'popover', //filter inputs will show in a popover (like excel)
    //onPaginationChange: setPagination,
    //onDensityChange:setDensity,
    muiPaginationProps: {
      showRowsPerPage: true,
      shape: 'rounded',
    },
   // enableStickyHeader: true,
    enableColumnOrdering: true,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
        <Button
          color="secondary"
          onClick={() => {
           // alert('Create New Account');
          }}
          variant="contained"
        >
          Listed
        </Button>
      </Box>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <Box>
       {/*
       } <IconButton
          onClick={() => {
            window.print();
          }}
        >
          <PrintIcon />
        </IconButton>
        */
}
        {/* along-side built-in buttons in whatever order you want them */}
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Box>
    ),
   // muiTableContainerProps: {
   //   sx: {
        // maxHeight: '500px'
   //   }
   // },
    // density,
    //  pagination,
    // columnFilterDisplayMode: 'custom',
    // muiFilterTextFieldProps: ({ column }) => ({
    //    label: `Filter by ${column.columnDef.header}`,
    // }),
  });

  return (
    <MaterialReactTable
      table={table}
    />
  );
};

export default DataTableActivity;
