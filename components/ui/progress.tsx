'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { value?: number }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-white relative h-4 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <motion.div
        data-slot="progress-indicator"
        className="bg-customGreen h-full w-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: value / 100 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={{ transformOrigin: 'left' }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
