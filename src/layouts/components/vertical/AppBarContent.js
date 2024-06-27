import * as React from 'react';

import Box from '@mui/material/Box'
//import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Menu from 'mdi-material-ui/Menu'
import FlowLogin from 'src/@core/layouts/components/shared-components/FlowLogin'
import Button from '@mui/material/Button';
import Cog from 'mdi-material-ui/Cog'

//import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
//import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

const AppBarContent = props => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const anchor = ['right']
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

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
       {
       /* <Button onClick={toggleDrawer(anchor, true)}>
            <Cog fontSize='small' />
          </Button> */
          } 
        {/*
        <NotificationDropdown />
        <UserDropdown />
        */}
      </Box>
    </Box>
  )
}

export default AppBarContent
