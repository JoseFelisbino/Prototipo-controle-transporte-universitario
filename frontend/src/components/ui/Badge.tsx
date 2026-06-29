import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'primary', children, ...props }) => {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase",
          {
            "bg-violet-500/15 text-violet-400 border border-violet-500/30": variant === 'primary',
            "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30": variant === 'success',
            "bg-amber-500/15 text-amber-400 border border-amber-500/30": variant === 'warning',
            "bg-rose-500/15 text-rose-400 border border-rose-500/30": variant === 'danger',
            "bg-zinc-800 text-zinc-400 border border-zinc-700/60": variant === 'neutral',
          }
        ),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
