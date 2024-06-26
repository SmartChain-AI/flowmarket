const DefaultPalette = (mode, themeColor) => {
  // ** Vars
  const lightColor = 'rgb(58, 53, 65)'
  const darkColor = 'rgb(231, 227, 252)'
  const mainColor = mode === 'light' ? lightColor : darkColor

  const primaryGradient = () => {
    if (themeColor === 'primary') {
      return '#4FD1C5'
    } else if (themeColor === 'secondary') {
      return '#4fd1c4'
    } else if (themeColor === 'success') {
      return '#93DD5C'
    } else if (themeColor === 'error') {
      return '#FF8C90'
    } else if (themeColor === 'warning') {
      return '#FFCF5C'
    } else {
      return '#6ACDFF'
    }
  }

  return {
    customColors: {
      main: mainColor,
      primaryGradient: primaryGradient(),
      tableHeaderBg: mode === 'light' ? '#F9FAFC' : '#3D3759'
    },
    common: {
      black: '#000',
      white: '#FFF'
    },
    mode: mode,
    primary: {
      light: '#9E69FD',
      main: '#9155FD',
      dark: '#804BDF',
      contrastText: '#FFF'
    },
    secondary: {
      light: '#9C9FA4',
      main: '#8A8D93',
      dark: '#777B82',
      contrastText: '#FFF'
    },
    highlight:{
      light: '#308179',
      main: '#4fd1c5',
      dark: '#4fd1c5',
      contrastText: '#FFF'
    },
    success: {
      light: '#6AD01F',
      main: '#56CA00',
      dark: '#4CB200',
      contrastText: '#FFF'
    },
    error: {
      light: '#FF6166',
      main: '#FF4C51',
      dark: '#E04347',
      contrastText: '#FFF'
    },
    warning: {
      light: '#FFCA64',
      main: '#FFB400',
      dark: '#E09E00',
      contrastText: '#FFF'
    },
    info: {
      light: '#32BAFF',
      main: '#16B1FF',
      dark: '#139CE0',
      contrastText: '#FFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#D5D5D5',
      A200: '#AAAAAA',
      A400: '#616161',
      A700: '#303030'
    },
    text: {
      primary: `${mainColor};opacity: 0.87`,
      secondary: `${mainColor};opacity: 0.68)`,
      disabled: `${mainColor};opacity: 0.38)`
    },
    divider: `${mainColor};opacity: 0.12)`,
    background: {
      paper: mode === 'light' ? '#FFF' : '#312D4B',
      default: mode === 'light' ? '#F4F5FA' : '#28243D'
    },
    action: {
      active: `${mainColor};opacity: 0.54)`,
   //   hover: `${mainColor};opacity: 0.04)`,
      selected: `${mainColor};opacity: 0.08)`,
      disabled: `${mainColor};opacity: 0.3)`,
      disabledBackground: `${mainColor};opacity: 0.18)`,
      focus: `${mainColor};opacity: 0.12)`
    }
  }
}

export default DefaultPalette
