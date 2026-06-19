import { describe, it, expect } from 'vitest';
import { validateEnvironment } from '../utils/envValidate';

describe('Environment Validator TestSuite', () => {

  it('passes validateEnvironment cleanly when valid setups are active', () => {
    const prevPort = process.env.PORT;
    const prevKey = process.env.GEMINI_API_KEY;

    process.env.PORT = '3000';
    process.env.GEMINI_API_KEY = 'super_secret_api_key_valid';

    expect(() => validateEnvironment()).not.toThrow();

    process.env.PORT = prevPort;
    process.env.GEMINI_API_KEY = prevKey;
  });

  it('rejects invalid NODE_ENV systems', () => {
    const prevEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'invalid_environment_name';

    expect(() => validateEnvironment()).toThrow('Security Validation Error');

    process.env.NODE_ENV = prevEnv;
  });

  it('rejects non-numeric host ports', () => {
    const prevPort = process.env.PORT;
    process.env.PORT = 'abc_port';

    expect(() => validateEnvironment()).toThrow('Security Validation Error');

    process.env.PORT = prevPort;
  });

  it('rejects suspicious GEMINI keys', () => {
    const prevKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'short'; // too short

    expect(() => validateEnvironment()).toThrow('Security Validation Error');

    process.env.GEMINI_API_KEY = prevKey;
  });
});
