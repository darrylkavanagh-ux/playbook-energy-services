import Link from 'next/link'


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
          <Link href="/" className="inline-block px-8 py-4 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-xl text-lg hover:bg-[#B8943E] transition-all duration-200 text-center">Return Home</Link>
        </Link>
      </div>
    </div>
  )
}