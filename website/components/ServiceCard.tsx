import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  href: string
  className?: string
}

export function ServiceCard({ title, description, icon, href, className }: ServiceCardProps) {
  return (
    <Link href={href} className={cn('group', className)}>
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full border border-greyLight hover:border-gold">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="text-textMid leading-relaxed">
          {description}
        </p>
        <div className="mt-4 text-gold font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
          Learn more →
        </div>
      </div>
    </Link>
  )
}