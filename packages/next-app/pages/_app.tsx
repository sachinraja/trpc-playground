import { AppType } from 'next/dist/shared/lib/utils'
import '../../core/global.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp
