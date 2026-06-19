import { HTMLAttributes, forwardRef } from 'react';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

/**
 * Elegant spinner loader containing soft spinning leaves.
 */
export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ className = '', size = 'md', overlay = false, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-5 w-5 border-2',
      md: 'h-8 w-8 border-3',
      lg: 'h-12 w-12 border-4',
    };

    const spinner = (
      <div className="flex flex-col items-center justify-center p-6 space-y-3">
        <div
          className={`animate-spin rounded-full border-t-emerald-600 border-stone-200 ${sizeClasses[size]}`}
        />
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
          Loading Sustainability data...
        </span>
      </div>
    );

    if (overlay) {
      return (
        <div
          ref={ref}
          className={`fixed inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-50 ${className}`}
          {...props}
        >
          {spinner}
        </div>
      );
    }

    return (
      <div ref={ref} className={`w-full flex items-center justify-center ${className}`} {...props}>
        {spinner}
      </div>
    );
  }
);

Loading.displayName = 'Loading';
