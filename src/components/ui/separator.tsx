import React from 'react'
import { cn } from '@/components/organismos/lib/utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <div
      className={cn('h-px w-full bg-muted', className)}
      {...props}
    />
  )
}
