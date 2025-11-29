import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, ExternalLink, CheckCircle, Loader2 } from 'lucide-react'
import { ShortenedUrl } from '@/types'
import { formatDate } from '@/lib/utils'
import { deleteShortenedUrl } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

interface UrlListProps {
  urls: ShortenedUrl[]
  onUrlDeleted: () => void
  loading?: boolean
}

export function UrlList({ urls, onUrlDeleted, loading }: UrlListProps) {
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)

  const handleCopy = async (url: ShortenedUrl) => {
    try {
      await navigator.clipboard.writeText(url.shortUrl)
      setCopiedId(url.id)
      toast({
        title: 'Copied!',
        description: 'Short URL copied to clipboard',
      })
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (code: string) => {
    setDeletingCode(code)
    try {
      await deleteShortenedUrl(code)
      toast({
        title: 'Deleted',
        description: 'URL removed successfully',
      })
      onUrlDeleted()
    } catch (error) {
      console.error('Error deleting URL:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete URL',
        variant: 'destructive',
      })
    } finally {
      setDeletingCode(null)
    }
  }

  if (loading) {
    return (
      <Card className="p-12 text-center border-border/30">
        <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-3" />
        <p className="text-sm text-muted-foreground">Loading your URLs...</p>
      </Card>
    )
  }

  if (urls.length === 0) {
    return (
      <Card className="p-12 text-center border-border/30 border-dashed">
        <div className="text-muted-foreground">
          <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No shortened URLs yet</p>
          <p className="text-xs mt-2 opacity-60">Create your first short link above</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {urls.map((url, index) => (
        <Card 
          key={url.id} 
          className="p-4 border-border/50 hover:border-primary/30 transition-all hover:glow-green animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline truncate text-sm"
                  >
                    {url.shortUrl}
                  </a>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {url.originalUrl}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {formatDate(url.createdAt)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(url)}
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {copiedId === url.id ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(url.code)}
                  disabled={deletingCode === url.code}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  {deletingCode === url.code ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
