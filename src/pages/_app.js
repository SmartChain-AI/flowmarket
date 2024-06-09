import Head from 'next/head'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import { CacheProvider } from '@emotion/react'
import themeConfig from 'src/configs/themeConfig'
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import 'react-perfect-scrollbar/dist/css/styles.css'
import '../../styles/globals.css'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName}`}
        />
        <meta name='keywords' content='flow, blockchain, $flow, ufc, strike, ufc strike, flow blockchain' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  )
}

export default App
