import { useState } from 'react'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { usePopper } from 'react-popper'
import Cog from 'mdi-material-ui/Cog'

const SettingsButton = () => {

  const [open, setOpen] = useState(false)
  const [popperElement, setPopperElement] = useState(null)
  const [referenceElement, setReferenceElement] = useState(null)

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: 'top-end'
  })

  const handleOpen = () => {
    setOpen(true)
    update ? update() : null
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box
      className='mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        component='button'
        target='_blank'
        variant='contained'
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        ref={e => setReferenceElement(e)}
        sx={{
          backgroundColor: 'black',
          boxShadow: '0 1px 10px 1px white',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
      >
        <Cog fontSize='medium' />
      </Button>
      <Fade in={open} timeout={700}>
        <Box
          style={styles.popper}
          ref={setPopperElement}
          {...attributes.popper}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          sx={{ pb: 4, minWidth: theme => (theme.breakpoints.down('sm') ? 400 : 300) }}
        >
          <Paper elevation={9} sx={{ borderRadius: 1, overflow: 'hidden' }}>
            <CardContent>
              <Typography sx={{ mb: 4 }} variant='h6'>
                FlowMarket settings
              </Typography>
              <img width='200' alt='ufcstrike-logo' src='/images/logos/ufcstrike.png' />
            </CardContent>
          </Paper>
        </Box>
      </Fade>
    </Box>
  )
}

export default SettingsButton
