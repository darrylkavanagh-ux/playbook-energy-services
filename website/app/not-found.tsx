import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="text-center text-white max-w-md mx-auto">
        <div className="text-8xl font-bold font-playfair text-gold mb-6">404</div>
        <h1 className="text-3xl font-bold font-playfair mb-4">Page Not Found</h1>
        <p className="text-greyLight mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="text-lg px-8 py-4">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}