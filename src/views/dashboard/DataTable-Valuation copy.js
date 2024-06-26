import { useMemo, useState, useEffect, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Image from 'next/image'
import Box from '@mui/material/Box'

const DataTableValuation = ({ data }) => {

  if (!data) return
  const isFirstRender = useRef(true);

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [density, setDensity] = useState({});
  const [globalFilter, setGlobalFilter] = useState(undefined);
  const [showGlobalFilter, setShowGlobalFilter] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnPinning, setColumnPinning] = useState([]);
  const [pagination, setPagination] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'edition_image',
        header: '',
        enableSorting: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: 'center',
          sx: {
            ms: '10px',
          }
        },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ renderedCellValue, row }) => (
          <a href={"https://ufcstrike.com/v2/moment/" + row.original.nft_id} target="_blank">
            <Image
              rel="preload"
              loading="lazy"
              quality={100}
              alt={row.original.moment_name}
              className={'moment-image fade-in'}
              /*  height={
                  density === 'comfortable' ? '25' : '85'
                }
                width={
                  density === 'comfortable' ? '25' : '85'
                }
                sizes={
                  density === 'comfortable' ? '25' : '85'
                }*/
              height={'100'}
              width={'100'}
              sizes={'100'}
              src={`/images/moments/${renderedCellValue}.jpg`}
            /></a>
        ),
      },
      {
        accessorKey: 'moment_name',
        header: 'Moment Name',
        muiTableHeadCellProps: {
          align: 'left',
          sx: {
            marginLeft: '10px',
          }
        },
        muiTableBodyCellProps: { align: 'left' },
      },
      {
        accessorKey: 'floor_price',
        header: 'Floor Price',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) =>
          cell.getValue().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
      },
      {
        accessorKey: 'serial',
        header: 'Serial',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) =>
          "#" + cell.getValue()
      },
      {
        accessorKey: 'mintage',
        header: 'Mintage',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'burned',
        header: 'Burned',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorFn: (row) => row.mintage - row.burned,
        id: 'remaining',
        header: 'Remaining',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'series',
        header: 'Series',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'set',
        header: 'Set',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'tier',
        header: 'Tier',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'reserves',
        header: 'Reserves',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'unopened',
        header: 'Unopened',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'owned',
        header: 'Owned',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'listed',
        header: 'Listed',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) =>
          cell.getValue() ? (
            cell.getValue().toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
          ) : (<>N/A</>)
        ,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: 'floor_price',
          desc: true,
        }
      ],
    },
    state: {
      columnFilters,
      columnOrder,
      columnVisibility,
      density,
      globalFilter,
      showColumnFilters,
      showGlobalFilter,
      sorting,
      columnPinning,
      pagination
    },
    enableColumnOrdering: true,
    enableColumnPinning: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onDensityChange: setDensity,
    onGlobalFilterChange: setGlobalFilter,
    onShowColumnFiltersChange: setShowColumnFilters,
    onShowGlobalFilterChange: setShowGlobalFilter,
    onSortingChange: setSorting,
    onDensityChange: setDensity,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: setPagination,

    //  layoutMode: 'grid-no-grow', //constant column widths
    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        padding: '0px',
        textAlign: 'center'
      },
    },
  });

  //load state from local storage
  useEffect(() => {
    const columnFilters = localStorage.getItem('valuation_table_columnFilters');
    const columnOrder = localStorage.getItem('valuation_table_columnOrder');
    const columnVisibility = localStorage.getItem('valuation_table_columnVisibility');
    const density = localStorage.getItem('valuation_table_density');
    const globalFilter = localStorage.getItem('valuation_table_globalFilter');
    const showGlobalFilter = localStorage.getItem('valuation_table_showGlobalFilter');
    const showColumnFilters = localStorage.getItem('valuation_table_showColumnFilters');
    const sorting = localStorage.getItem('valuation_table_sorting');
    const columnPinning = localStorage.getItem('valuation_table_columnPinning');
    const pagination = localStorage.getItem('valuation_table_pagination');

    if (columnFilters) {
      setColumnFilters(JSON.parse(columnFilters));
    }
    if (columnOrder) {
      setColumnOrder(JSON.parse(columnOrder));
    }
    if (columnVisibility) {
      setColumnVisibility(JSON.parse(columnVisibility));
    }
    if (density) {
      setDensity(JSON.parse(density));
    }
    if (globalFilter) {
      setGlobalFilter(JSON.parse(globalFilter) || undefined);
    }
    if (showGlobalFilter) {
      setShowGlobalFilter(JSON.parse(showGlobalFilter));
    }
    if (showColumnFilters) {
      setShowColumnFilters(JSON.parse(showColumnFilters));
    }
    if (sorting) {
      setSorting(JSON.parse(sorting));
    }
    if (columnPinning) {
      setColumnPinning(JSON.parse(columnPinning));
    }
    if (pagination) {
      setPagination(JSON.parse(pagination));
    }
    isFirstRender.current = false;
  }, []);

  //save states to local storage
  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem(
      'valuation_table_columnFilters',
      JSON.stringify(columnFilters),
    );
  }, [columnFilters]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem(
      'valuation_table_columnOrder',
      JSON.stringify(columnOrder),
    );
  }, [columnOrder]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem(
      'valuation_table_columnVisibility',
      JSON.stringify(columnVisibility),
    );
  }, [columnVisibility]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem('valuation_table_density', JSON.stringify(density));
  }, [density]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem(
      'valuation_table_globalFilter',
      JSON.stringify(globalFilter ?? ''),
    );
  }, [globalFilter]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem(
      'valuation_table_showGlobalFilter',
      JSON.stringify(showGlobalFilter),
    );
  }, [showGlobalFilter]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem(
      'valuation_table_showColumnFilters',
      JSON.stringify(showColumnFilters),
    );
  }, [showColumnFilters]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem('valuation_table_sorting', JSON.stringify(sorting));
  }, [sorting]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem('valuation_table_columnPinning', JSON.stringify(columnPinning));
  }, [columnPinning]);

  useEffect(() => {
    if (isFirstRender.current) return;
    localStorage.setItem('valuation_table_pagination', JSON.stringify(pagination));
  }, [pagination]);

  return <MaterialReactTable table={table} />;
};

export default DataTableValuation;
