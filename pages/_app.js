import Head from 'next/head'

import 'styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>sobrang log</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel="icon" href="icon.jpg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
