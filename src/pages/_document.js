import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FBFAF9"/>
        <meta name="application-name" content="Bookmarks" />
        <meta name="apple-mobile-web-app-title" content="Bookmarks" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="description" content="Bookmarks, built for Built for personal usage, designed by Alda Julian" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
