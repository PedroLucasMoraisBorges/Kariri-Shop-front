import * as React from 'react'

import { cn } from '@/lib/utils'

const InputKariri = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 rounded-md border px-10 py-1 text-base text-black shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-950 dark:text-white md:text-sm',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
InputKariri.displayName = 'InputKariri'

export { InputKariri }
