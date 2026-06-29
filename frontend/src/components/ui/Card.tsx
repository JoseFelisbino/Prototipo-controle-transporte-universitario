import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={twMerge(
        "glass-card rounded-xl p-6 shadow-xl border border-zinc-800/40 relative overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
