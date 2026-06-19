import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock window.print
window.print = vi.fn();

// Mock ResizeObserver for Recharts / canvas support
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// Mock localStorage if needed, though jsdom has a basic one
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
