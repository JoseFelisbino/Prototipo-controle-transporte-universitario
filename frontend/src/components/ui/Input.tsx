import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-150",
              {
                "border-red-500 focus:ring-red-500": error,
              }
            ),
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-400">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
