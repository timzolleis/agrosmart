import { cn } from '~/lib/utils';
import * as React from 'react';

interface MaxWidthProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MaxWidth({ className, children, ...props }: MaxWidthProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-6xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}