import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Sparkles, AlertCircle } from 'lucide-react'
import { generateShortCode, isValidUrl } from '@/lib/utils'
import { saveShortenedUrl, isAtMaxCapacity, getUrlCount } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'

interface UrlShortenerFormProps {
  onUrlShortened: () => void
}

export function UrlShortenerForm({ onUrlShortened }: UrlShortenerFormProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      toast({
        title: 'URL Required',
        description: 'Please enter a URL to shorten',
        variant: 'destructive',
      })
      return
    }

    if (!isValidUrl(url)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL (include http:// or https://)',
        variant: 'destructive',
      })
      return
    }

    if (isAtMaxCapacity()) {
      toast({
        title: 'Limit Reached',
        description: 'Maximum 11 URLs allowed. Delete some to add more.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    
    try {
      const code = generateShortCode()
      
      await saveShortenedUrl(code, url)
      
      toast({
        title: 'URL Shortened! 🎉',
        description: 'Your short URL has been created successfully',
      })
      
      setUrl('')
      onUrlShortened()
    } catch (error) {
      console.error('Error shortening URL:', error)
      toast({
        title: 'Error',
        description: 'Failed to shorten URL. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const urlCount = getUrlCount()
  const isNearLimit = urlCount >= 9

  return (
    <Card className="p-6 mb-8 border-border/50 glow-green">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="Enter your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base bg-secondary/50 border-border/50 focus:border-primary transition-colors"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {urlCount} / 11 URLs used
            </span>
            {isNearLimit && (
              <span className="text-yellow-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Approaching limit
              </span>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all hover:glow-green-lg"
          disabled={isLoading || isAtMaxCapacity()}
        >
          {isLoading ? (
            'Shortening...'
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Shorten URL
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}
