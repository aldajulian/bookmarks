import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="Bookmarks" />
        <meta name="apple-mobile-web-app-title" content="Bookmarks" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
