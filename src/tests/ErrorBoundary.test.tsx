import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// A helper component that throws an error when a flag is set
const ProblematicComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test rendering crash');
  }
  return <div id="success_element">Normal Component Content</div>;
};

describe('ErrorBoundary Component', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Prevent Vitest/React from spitting uncaught error logs during expected boundary testing
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children normally when there is no error rendering', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component Content')).toBeInTheDocument();
    expect(screen.queryByText('Structural Rendering Crash')).not.toBeInTheDocument();
  });

  it('catches crashes, renders high contrast fallback card, and safely displays error logs', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Structural Rendering Crash')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error while rendering this section/)).toBeInTheDocument();
    expect(screen.getByText('Test rendering crash')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('renders custom fallback element when provided, instead of default UI card', () => {
    render(
      <ErrorBoundary fallback={<div id="custom_fallback">Custom Recovered Screen</div>}>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Recovered Screen')).toBeInTheDocument();
    expect(screen.queryByText('Structural Rendering Crash')).not.toBeInTheDocument();
  });

  it('attaches location reloading trigger onto reload action button', () => {
    // Mock page reloading method
    const originalReload = window.location.reload;
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: reloadMock }
    });

    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByRole('button', { name: /Reload Page/ });
    expect(reloadBtn).toBeInTheDocument();
    fireEvent.click(reloadBtn);

    expect(reloadMock).toHaveBeenCalledTimes(1);

    // Restore reload
    window.location.reload = originalReload;
  });
});
