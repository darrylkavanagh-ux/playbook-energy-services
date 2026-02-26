import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  className?: string
}

export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </section>
  )
}

interface SectionLabelProps {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn('text-gold text-sm font-dm-sans uppercase tracking-wider font-semibold mb-2', className)}>
      {children}
    </div>
  )
}

interface SectionTitleProps {
  children: ReactNode
  className?: string
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2 className={cn('font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6', className)}>
      {children}
    </h2>
  )
}

export function GoldRule({ className }: { className?: string }) {
  return <div className={cn('h-px bg-gold w-24 mx-auto', className)} />
}