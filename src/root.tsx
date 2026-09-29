import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Route } from './+types/root'
import './i18n'
import './index.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { PageIntro } from './components/PageIntro'
import { useSavedLanguage } from './hooks/useLanguage'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap',
  },
]

// Applies the saved theme before first paint to avoid a flash; dark is the default.
const themeScript = `try{if(localStorage.getItem('theme')==='light')document.documentElement.dataset.theme='light'}catch(_){}`

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0a0a0b" />
        {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- static inline script, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  useSavedLanguage()

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Shown by the SPA fallback page (URLs that were not prerendered) until the app loads.
export function HydrateFallback() {
  return null
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  if (!notFound && import.meta.env.DEV) console.error(error) // eslint-disable-line no-console
  const key = notFound ? 'notFound' : 'error'

  return (
    <>
      <Header />
      <main>
        <PageIntro tag={notFound ? '404' : 'Error'} title={t(`${key}.title`)} intro={t(`${key}.intro`)} />
      </main>
      <Footer />
    </>
  )
}
