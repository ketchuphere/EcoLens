import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from '../utils/logger';

describe('Logger Utility TestSuite', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('correctly logs info events under logger', () => {
    Logger.info('Hello Info');
    expect(logSpy).toHaveBeenCalledWith('[EcoLens] Hello Info');
  });

  it('correctly logs warnings under logger', () => {
    Logger.warn('Hello Warn');
    expect(warnSpy).toHaveBeenCalledWith('[EcoLens WARN] Hello Warn');
  });

  it('correctly logs errors without specific details under logger', () => {
    Logger.error('Hello Error');
    expect(errorSpy).toHaveBeenCalledWith('[EcoLens ERROR] Hello Error');
  });

  it('correctly logs errors with specific error reasons under logger', () => {
    const testError = new Error('Database connection failed');
    Logger.error('Failed to query', testError);
    expect(errorSpy).toHaveBeenCalledWith('[EcoLens ERROR] Failed to query', testError);
  });

  it('allows logging verbose statements in development modes', () => {
    // Save previous state
    const prevNodeEnv = process.env.NODE_ENV;
    
    // Test in environment NOT production
    process.env.NODE_ENV = 'development';
    Logger.verbose('Detailed Trace');
    expect(logSpy).toHaveBeenCalledWith('[EcoLens DEBUG] Detailed Trace');

    // Restore environmental configuration
    process.env.NODE_ENV = prevNodeEnv;
  });
});
