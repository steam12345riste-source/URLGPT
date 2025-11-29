import { Link2 } from 'lucide-react'

export function Header() {
  return (
    <header className="text-center mb-12 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="relative">
          <Link2 className="w-10 h-10 text-primary animate-glow" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl font-bold gradient-text">
          URLGPT
        </h1>
      </div>
      <p className="text-muted-foreground text-sm tracking-wide">
        by <span className="text-primary font-medium">ExploitZ3r0</span>
      </p>
      <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
        Transform long URLs into short, shareable links instantly
      </p>
    </header>
  )
}
