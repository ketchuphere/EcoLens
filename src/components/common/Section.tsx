import React, { HTMLAttributes, forwardRef, ReactNode } from 'react';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  headerRight?: ReactNode;
}

/**
 * Standard content block with clean top spacing, heading styles, and side slots.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = '', title, description, headerRight, ...props }, ref) => {
    return (
      <section ref={ref} className={`space-y-6 ${className}`} {...props}>
        {(title || description || headerRight) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              {title && (
                <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-stone-500 font-medium font-sans mt-1">
                  {description}
                </p>
              )}
            </div>
            {headerRight && <div className="flex items-center gap-3">{headerRight}</div>}
          </div>
        )}
        <div>{children}</div>
      </section>
    );
  }
);

Section.displayName = 'Section';
