/**
 * Centralised Logging Utility to control verbose outputs across development and production states.
 * Development: full verbose output, Production: minimal lightweight summaries.
 */

const isProd = process.env.NODE_ENV === 'production';

export const Logger = {
  verbose(msg: string, ...optionalParams: unknown[]): void {
    if (!isProd) {
      console.log(`[EcoLens DEBUG] ${msg}`, ...optionalParams);
    }
  },

  info(msg: string, ...optionalParams: unknown[]): void {
    // Info level is logged in both, but cleanly styled
    console.log(`[EcoLens] ${msg}`, ...optionalParams);
  },

  warn(msg: string, ...optionalParams: unknown[]): void {
    console.warn(`[EcoLens WARN] ${msg}`, ...optionalParams);
  },

  error(msg: string, err?: unknown): void {
    if (err) {
      console.error(`[EcoLens ERROR] ${msg}`, err);
    } else {
      console.error(`[EcoLens ERROR] ${msg}`);
    }
  }
};
