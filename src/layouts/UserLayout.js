import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import VerticalLayout from 'src/@core/layouts/VerticalLayout'
import VerticalNavItems from 'src/navigation/vertical'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useTheme } from '@mui/material/styles'
import Fade from '@mui/material/Fade';
import Image from 'next/image'

const UserLayout = ({ children }) => {

  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const theme = useTheme()
  const imageSrc = theme.palette.mode

  const UFCStrikeImg = () => {
    return (
      <Box sx={{ mx: 'auto', textAlign: 'center' }}>
        <Fade in={true} timeout={1500}>
          <Image width={100} height={100} priority={true} loading = 'eager' className={imageSrc === 'dark' ? 'logo-image-dark' : 'logo-image'} alt='UFC Strike' src={`/images/logos/ufcstrike.png`} />
        </Fade>
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
      </Box>
    </VerticalLayout>
  )
}

export default UserLayout
