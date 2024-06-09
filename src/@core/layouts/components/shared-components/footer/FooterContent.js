import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize:'0.7em', width:'100%', textAlign:'center' }}>
        {`© ${new Date().getFullYear()} Flowmarket`}
      </Typography>
    </Box>
  )
}

export default FooterContent
