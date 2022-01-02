import { AppType } from 'next/dist/shared/lib/utils'
import '../../components/global.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp
