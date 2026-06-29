import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          {
            "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20": variant === 'primary',
            "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60": variant === 'secondary',
            "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-200": variant === 'outline',
            "hover:bg-zinc-800/60 text-zinc-300": variant === 'ghost',
            "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20": variant === 'danger',
            
            "px-3 py-1.5 text-xs": size === 'sm',
            "px-4 py-2 text-sm": size === 'md',
            "px-6 py-3 text-base": size === 'lg',
          },
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
