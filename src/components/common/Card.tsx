import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

/**
 * Reusable layout card, matching clean borders, offsets, and smooth hover responses.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white border border-stone-200/90 rounded-[24px] p-6 shadow-sm transition-all duration-300 ${
          hoverEffect ? 'hover:shadow-md hover:border-stone-300' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
