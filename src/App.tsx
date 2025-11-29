import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { UrlShortenerForm } from '@/components/UrlShortenerForm'
import { UrlList } from '@/components/UrlList'
import { RedirectPage } from '@/components/RedirectPage'
import { Toaster } from '@/components/ui/toaster'
import { getShortenedUrls } from '@/lib/storage'
import { ShortenedUrl } from '@/types'

function HomePage() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([])
  const [loading, setLoading] = useState(true)

  const loadUrls = async () => {
    setLoading(true)
    const fetchedUrls = await getShortenedUrls()
    setUrls(fetchedUrls)
    setLoading(false)
  }

  useEffect(() => {
    loadUrls()
  }, [])

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Header />
        <UrlShortenerForm onUrlShortened={loadUrls} />
        <UrlList urls={urls} onUrlDeleted={loadUrls} loading={loading} />
      </div>
    </div>
  )
}

// Route handler to check if code exists or show homepage
function RouteHandler() {
  const params = useParams()
  const code = params['*'] // Catch-all route

  // If code looks like a 6-character alphanumeric string, treat as redirect
  if (code && /^[A-Za-z0-9]{6}$/.test(code)) {
    return <RedirectPage />
  }

  // Otherwise show homepage
  return <HomePage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<RouteHandler />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
