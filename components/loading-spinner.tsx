import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent',
          sizeClasses[size],
          'border-4 border-[#4a6b4a]'
        )}
      />
      <div
        className={cn(
          'absolute top-0 left-0 animate-ping opacity-75',
          sizeClasses[size],
          'rounded-full border-2 border-[#2c3e2e]'
        )}
      />
      <div
        className={cn(
          'absolute top-0 left-0 animate-pulse opacity-50',
          sizeClasses[size],
          'rounded-full border border-[#1d3557]'
        )}
      />
    </div>
  );
}
