import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const CardAccountFloorValue = ({ amount, other }) => {
  return (
    <Card>
      <CardHeader title='Account Floor Value' />
      <CardContent>
        {other ? (
          <Box sx={{ display: 'flex' }}>
           {
           /* <Box pb="2" w='75px' sx={{ display: 'inline-flex' }}>
            <img src={other.im} alt="" width="50" height="50" />
            </Box> */
            }
            <Box pb="2" ps="2" w='100%' sx={{ display: 'inline-flex', margin: 'auto' }}><Typography variant='body2'>{other.usname}</Typography></Box>
          </Box>
        ) : (
          <></>
        )}
        <Box>
          <Box pt="4"><Box sx={{ display: 'inline-flex' }} ps="2">{amount}</Box></Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardAccountFloorValue
