import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates crucial environment configurations for EcoLens deployment.
 * Triggers safe descriptive errors if misconfigurations are present.
 * Prevents leaks of internal variables, values, or credentials.
 */
export function validateEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV;

  // Let's validate NODE_ENV if set
  if (nodeEnv && !['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error(
      'Security Validation Error: Standard deployment NODE_ENV must be set to either development, production, or test.'
    );
  }

  // Check required node server configuration
  if (process.env.PORT) {
    const portNum = parseInt(process.env.PORT, 10);
    if (isNaN(portNum) || portNum < 0 || portNum > 65535) {
      throw new Error('Security Validation Error: PORT must represent a valid numeric network host port.');
    }
  }

  // Example API keys - check if they are formatted correctly if set
  // This demonstrates safe checking without exposing anything.
  if (process.env.GEMINI_API_KEY) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey.length < 10) {
      throw new Error('Security Validation Error: Configured GEMINI_API_KEY value is suspiciously short or malformed.');
    }
  }
}
