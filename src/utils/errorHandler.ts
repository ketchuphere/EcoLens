import { Logger } from './logger';

/**
 * Robust, production-safe Error Handling utility.
 * Sanitizes and formats errors into user-friendly messages without leaking sensitive trace stacks.
 */
export class EcoLensErrorHandler {
  /**
   * Safe registration and logging of an action error.
   * Logs securely to the server/console with appropriate severity levels.
   */
  static handleError(err: unknown, fallbackMessage = 'An unexpected environmental metric error occurred.'): string {
    let internalMessage = '';
    let userMessage = fallbackMessage;

    if (err instanceof Error) {
      internalMessage = err.message;
      
      // Map standard exceptions to clean and clear instructions
      if (err.name === 'ValidationError' || internalMessage.includes('validation') || internalMessage.includes('invalid')) {
        userMessage = 'Some calculation values did not meet security limits. Please verify your inputs and try again.';
      } else if (internalMessage.includes('localStorage') || internalMessage.includes('QuotaExceeded')) {
        userMessage = 'Local disk storage capacity exceeded. Consider clearing some history records or daily habits logs.';
      } else if (internalMessage.includes('fetch') || internalMessage.includes('network') || internalMessage.includes('HTTP')) {
        userMessage = 'A network connection difficulty was detected. Please check your system connection.';
      } else if (err instanceof RangeError || internalMessage.includes('out of range') || internalMessage.includes('negative')) {
        userMessage = 'Input value exceeded healthy bounds. Please make sure all values are non-negative.';
      } else if (err instanceof SyntaxError || internalMessage.includes('parse') || internalMessage.includes('JSON')) {
        userMessage = 'Storage verification check. A data parsing mismatch was safely caught and mitigated.';
      }
    } else if (typeof err === 'string') {
      internalMessage = err;
    } else {
      internalMessage = JSON.stringify(err);
    }

    // Secure production-safe logging under the hood with minimal clean metadata
    Logger.error(`[Error Handler Captured] ${internalMessage || userMessage}`);

    return userMessage;
  }
}
