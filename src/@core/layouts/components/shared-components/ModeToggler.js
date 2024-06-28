import IconButton from '@mui/material/IconButton'
import WeatherNight from 'mdi-material-ui/WeatherNight'
import WeatherSunny from 'mdi-material-ui/WeatherSunny'
import Box from '@mui/material/Box';


const ModeToggler = props => {
  const { settings, saveSettings } = props

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode })
    const usermode = JSON.parse(localStorage.getItem("flowmarket"))

    localStorage.setItem("flowmarket", JSON.stringify({
      ...usermode,
      "mode": mode,
    }))
  }

  const handleModeToggle = () => {
    if (settings.mode === 'dark') {
      handleModeChange('light')
    } else {
      handleModeChange('dark')
    }
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}  sx={{borderRadius:'0px !important'}}>
      {settings.mode === 'dark' ? <WeatherNight /> : <WeatherSunny />} &nbsp;<Box component="span" className={"modetoggle"}>{settings.mode + ' mode'}</Box>
    </IconButton>
  )
}

export default ModeToggler
