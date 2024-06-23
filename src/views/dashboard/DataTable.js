import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Image from 'next/image'
import Box from '@mui/material/Box'

const DataTable = ({data}) => {

  if (!data) return

  const columns = useMemo(
    () => [
      {
        accessorKey: 'Image',
        header: 'Image',
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
        <Image
          rel="preload"
          loading="lazy"
          quality={100}
          alt=""
          className={'moment-image fade-in'}
          height={'85'}
          width={'85'}
          sizes="85px"
          src={`/images/moments/${renderedCellValue}.jpg`}
          />
          </Box>
        ),
      },
      {
        accessorKey: 'Moment Name',
        //enableColumnOrdering: false, //disable column ordering for this column,
        header: 'Moment Name',
      },
      {
        accessorKey: 'Floor Price',
        header: 'Floor Price',
        Cell: ({ renderedCellValue, row }) => (
          <span>${renderedCellValue}</span>
        )
        },
      {
        accessorKey: 'Serial',
        header: 'Serial',
      },
      {
        accessorKey: 'Mintage',
        header: 'Mintage',
      },
      {
        accessorKey: 'Series',
        header: 'Series',
      },
      {
        accessorKey: 'Set',
        header: 'Set',
      },
      {
        accessorKey: 'Tier',
        header: 'Tier',
      },
      {
        accessorKey: 'Burned',
        header: 'Burned',
      },
      {
        accessorKey: 'Reserves',
        header: 'Reserves',
      },
      {
        accessorKey: 'Unopened',
        header: 'Unopened',
      },
      {
        accessorKey: 'Owned',
        header: 'Owned',
      },
      {
        accessorKey: 'Listed',
        header: 'Listed',
        Cell: ({ renderedCellValue, row }) => (
          <span>${renderedCellValue}</span>
        )
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnOrdering: true,
  });

  return <MaterialReactTable table={table} />;
};

export default DataTable;