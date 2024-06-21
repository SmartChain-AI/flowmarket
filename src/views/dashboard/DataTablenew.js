import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Image from 'next/image'
import Box from '@mui/material/Box'

const DataTable = ({data}) => {
  //should be memoized or stable
  if (!data) return
/*
            'id': uid,
            'athlete_name': moment.metadata['ATHLETE NAME'],
            'Moment Name': mname,
            'Serial': moment.edition_number,
            'Mintage': moment.max_editions,
            'Series': moment.metadata['SERIES'],
            'Set': moment.metadata['SET'],
            'Tier': moment.metadata['TIER'],
            'Image': moment.metadata['preview'],
            'set_id': moment.set_id,
            'Image': moment.set_id,
            'Burned': found.burnedCount,
            'Reserves': found.inReservesCount,
            'Unopened': found.inUnopenedPackCount,
            'Owned': found.ownedCount,
            'Floor Price': Number(lp.listing_price),
            'Listed': Number(moment.listing_price),
            'Received': moment.deposit_block_height,
            'nft_id': moment.nft_id
*/
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