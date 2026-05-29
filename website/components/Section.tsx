import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <div className={`max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}

interface SectionLabelProps {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div className={`eyebrow ${className}`}>
      {children}
    </div>
  )
}

interface SectionTitleProps {
  children: ReactNode
  className?: string
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`font-playfair text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 ${className}`}>
      {children}
    </h2>
  )
}

export function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`gold-rule ${className}`} />
}

export function GoldRuleLeft({ className = '' }: { className?: string }) {
  return <div className={`gold-rule-left ${className}`} />
}
