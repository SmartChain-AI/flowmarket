import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import AccountCircleOutline from 'mdi-material-ui/AccountCircleOutline'

const TotalEarning = ({ amount,accimage,accname,walletid }) => {

  //if(!other.im){
   // other = {'im':null}
  //}

  return (
    <Card sx={{ textAlign: 'left', mt: 4 }}>
      <CardHeader
        title='Account Floor Value'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ display: 'flex', pb: 2 }}>
              <Box pb="2" w='75px' sx={{ display: 'inline-block' }}>
              {
                accimage ? (<>
                  <img src={accimage} alt="" width="50" height="50" />
                </>) : (<>
                  <AccountCircleOutline fontSize='large' />
                </>)
}
              </Box>
              <Box
                w='100%'
                sx={{
                  display: 'inline-block',
                  margin: 'auto 0',
                  pl: 2,
                  pb: 1
                }}>
                <Typography variant='h5' className="username">{accname??walletid}</Typography>
              </Box>
        </Box>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Box pt="4">
            <Box sx={{ display: 'inline-flex' }} ps="2">
              <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
                {amount}
              </Typography>
            </Box>
          </Box>
          {/*<Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
              10%
            </Typography>
          </Box>*/}
        </Box>
      </CardContent>
    </Card>
  )
}

export default TotalEarning
