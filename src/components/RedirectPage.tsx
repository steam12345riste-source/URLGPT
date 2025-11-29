import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { findUrlByCode } from '@/lib/storage'
import { Loader2, Link2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RedirectPage() {
  const params = useParams()
  const code = params['*'] // Get code from catch-all route
  const [redirecting, setRedirecting] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [targetUrl, setTargetUrl] = useState('')

  useEffect(() => {
    if (!code || !/^[A-Za-z0-9]{6}$/.test(code)) {
      setNotFound(true)
      setRedirecting(false)
      return
    }

    const fetchAndRedirect = async () => {
      const url = await findUrlByCode(code)
      
      if (url) {
        // Instant redirect
        window.location.href = url
      } else {
        setNotFound(true)
        setRedirecting(false)
      }
    }

    fetchAndRedirect()
  }, [code])

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Link2 className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
              <h1 className="text-3xl font-bold text-gray-900">URLGPT</h1>
            </div>
            <p className="text-gray-600 text-sm">by ExploitZ3r0</p>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Error: Short URL Not Found</h2>
                <p className="text-red-700 leading-relaxed">
                  The short URL <strong>{window.location.origin}/{code}</strong> does not exist or may have been deleted.
                </p>
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What can I do?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Check if you typed the URL correctly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>The link may have been deleted by its creator</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Create a new short URL from our homepage</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1 h-12 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Create New Short URL
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Need help? Contact us at <a href="mailto:support@urlgpt.com" className="text-emerald-600 hover:underline">support@urlgpt.com</a></p>
          </div>
        </div>
      </div>
    )
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link2 className="w-10 h-10 text-emerald-500" strokeWidth={2.5} />
            <h1 className="text-4xl font-bold text-gray-900">URLGPT</h1>
          </div>
          
          {/* Loading Animation */}
          <div className="mb-6">
            <Loader2 className="w-16 h-16 mx-auto text-emerald-500 animate-spin" />
          </div>
          
          {/* Status */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Redirecting...</h2>
          <p className="text-gray-600 mb-6">Please wait while we redirect you to:</p>
          
          {/* Target URL Display */}
          {targetUrl && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 text-center break-all">{targetUrl}</p>
            </div>
          )}
          
          {/* Manual Link */}
          <p className="text-sm text-gray-500">
            Not redirecting automatically?{' '}
            <a 
              href={targetUrl} 
              className="text-emerald-600 hover:underline font-semibold"
            >
              Click here
            </a>
          </p>
        </div>
      </div>
    )
  }

  return null
}
