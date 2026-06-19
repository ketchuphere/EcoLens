import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Standardised Action Button, supporting primary emerald shades, secondary slates, and borders.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center font-bold transition-all transition-colors duration-200 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none';
    
    const sizeStyles = {
      sm: 'py-1.5 px-3 text-[11px]',
      md: 'py-2 px-4 text-xs',
      lg: 'py-2.5 px-6 text-sm',
    };

    const variantStyles = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-3xs',
      secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/60',
      danger: 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100',
      ghost: 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
