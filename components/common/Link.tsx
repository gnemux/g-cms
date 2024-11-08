import NextLink from 'next/link'
import { AnchorHTMLAttributes, ReactNode } from 'react'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
  className?: string
}

export default function Link({ href, children, className, ...props }: LinkProps) {
  return (
    <NextLink 
      href={href} 
      {...props}
    >
      <span className={className}>
        {children}
      </span>
    </NextLink>
  )
} 