import { useEffect } from 'react'
import Box from '@mui/material/Box'
//import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Menu from 'mdi-material-ui/Menu'

import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
//import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
//import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import * as fcl from "@onflow/fcl"
import { ThemeProvider, createTheme } from '@mui/material/styles'

const AppBarContent = props => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))

  fcl.config({
    "discovery.wallet": "https://fcl-discovery.onflow.org/mainnet/authn",
  })

  useEffect(() => {
    if (settings.mode) {
      localStorage.setItem("flowmarket", JSON.stringify({
        "mode": settings.mode
      }))
    }
  }, [settings])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        {/*
        <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        />
      */  }
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeToggler
          settings={settings}
          saveSettings={saveSettings}
        // onClick={()=>{changemode(settings.mode)}}
        />
        {/*
        <NotificationDropdown />
        <UserDropdown />
        */}
      </Box>
    </Box>
  )
}

export default AppBarContent
