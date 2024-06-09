import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import VerticalLayout from 'src/@core/layouts/VerticalLayout'
import VerticalNavItems from 'src/navigation/vertical'
import SettingsDrawer from 'src/layouts/components/SettingsDrawer'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useTheme } from '@mui/material/styles'

const UserLayout = ({ children }) => {

  const { settings, saveSettings } = useSettings()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const theme = useTheme()
  const imageSrc = theme.palette.mode

  const UFCStrikeImg = () => {
    return (
      <Box sx={{ mx: 'auto', textAlign: 'center' }}>
        <img width={125} height={125} className={imageSrc === 'dark' ? 'logo-image-dark' : 'logo-image'} alt='UFC Strike' src={`/images/logos/ufcstrike.png`} />
      </Box>
    )
  }

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={VerticalNavItems()} // Navigation Items
      beforeVerticalNavMenuContent={UFCStrikeImg}
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {children}
      <Box
        className='mui-fixed'
        sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
      >
      {/*
        <SettingsDrawer />
*/}
      </Box>
    </VerticalLayout>
  )
}

export default UserLayout
