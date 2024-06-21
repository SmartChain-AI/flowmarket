import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import WeatherNight from 'mdi-material-ui/WeatherNight'
import WeatherSunny from 'mdi-material-ui/WeatherSunny'

const ModeToggler = props => {
  // ** Props
  const { settings, saveSettings } = props

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode })
    const yo = JSON.parse(localStorage.getItem("flowmarket"))
console.info(yo)
    localStorage.setItem("flowmarket", JSON.stringify({
      ...yo,
      "mode": mode,
      //"address": settings.addr

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
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      {settings.mode === 'dark' ? <WeatherNight /> : <WeatherSunny />}
    </IconButton>
  )
}

export default ModeToggler
