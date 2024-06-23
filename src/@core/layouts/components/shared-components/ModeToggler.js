import IconButton from '@mui/material/IconButton'
import WeatherNight from 'mdi-material-ui/WeatherNight'
import WeatherSunny from 'mdi-material-ui/WeatherSunny'

const ModeToggler = props => {
  const { settings, saveSettings } = props

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode })
    const yo = JSON.parse(localStorage.getItem("flowmarket"))

    localStorage.setItem("flowmarket", JSON.stringify({
      ...yo,
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
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      {settings.mode === 'dark' ? <WeatherNight /> : <WeatherSunny />}
    </IconButton>
  )
}

export default ModeToggler
