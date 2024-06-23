import Box from '@mui/material/Box'
//import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Menu from 'mdi-material-ui/Menu'

import FlowLogin from 'src/@core/layouts/components/shared-components/FlowLogin'

//import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
//import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

//import { ThemeProvider, createTheme } from '@mui/material/styles'

const AppBarContent = props => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))

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
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <FlowLogin
          settings={settings}
          saveSettings={saveSettings}
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
