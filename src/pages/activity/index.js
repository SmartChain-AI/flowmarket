import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Events from "src/views/cards/Events";
import DailySales from 'src/views/cards/DailySales'

const CardBasic = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={6} sx={{ paddingBottom: 4 }}>
        <DailySales />
      </Grid>
      <Grid item xs={6} sx={{ paddingBottom: 4 }}>
        <DailySales />
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5' sx={{ pb: '10px' }}>Live Marketplace Activity</Typography>
       { //<Events />
}
      </Grid>
    </Grid>
  )
}

export default CardBasic
