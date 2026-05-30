import Link from 'next/link'

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  href: string
  className?: string
}

export function ServiceCard({ title, description, icon, href, className = '' }: ServiceCardProps) {
  return (
    <Link href={href} className={`group block h-full ${className}`}>
      <div className="card-premium h-full p-7 flex flex-col">
        {/* Icon circle */}
        <div className="w-14 h-14 rounded-xl bg-[rgba(196,164,78,0.1)] border border-[rgba(196,164,78,0.2)] flex items-center justify-center mb-5 text-2xl group-hover:bg-[rgba(196,164,78,0.18)] group-hover:border-[rgba(196,164,78,0.45)] transition-all duration-300 flex-shrink-0">
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-playfair text-[1.05rem] font-bold text-white mb-3 group-hover:text-[#C4A44E] transition-colors duration-300 leading-snug">
          {title}
        </h3>
        <p className="text-[0.83rem] text-[rgba(248,246,241,0.58)] leading-relaxed flex-1">
          {description}
        </p>

        {/* Arrow CTA */}
        <div className="mt-5 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wider text-[rgba(196,164,78,0.6)] group-hover:text-[#C4A44E] transition-colors duration-300">
          Explore
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
