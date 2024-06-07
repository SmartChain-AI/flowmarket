// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

const CardAccountFloorValue = ({ amount, other }) => {
  return (
    <Card>
      <CardHeader title='Account Floor Value' />
      <CardContent>
        <Typography variant='body2'>

          {other ? (
            <Box sx={{ display: 'flex' }}>
              <Box pb="2" w='75px' sx={{ display: 'inline-flex' }}><img src={other.im} alt="" width="50" height="50" /></Box>
              <Box pb="2" ps="2" w='100%' sx={{ display: 'inline-flex', margin: 'auto' }}>{other.usname}</Box>
            </Box>
          ) : (
            <></>
          )}
          <Box>
            <Box pt="4"><Box sx={{ display: 'inline-flex' }}>Floor Value:</Box><Box sx={{ display: 'inline-flex' }} ps="2">{amount}</Box></Box>
          </Box>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardAccountFloorValue
