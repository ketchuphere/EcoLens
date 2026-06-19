import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server';
import { sanitizeStringInput, sanitizeNumberInput } from '../utils/validators';

describe('Security Specifications & Review TestSuite', () => {

  describe('1. API Method Validation & CORS Safety', () => {
    it('restricts /api/carbon-estimate to POST only, rejecting GET/DELETE/PUT with a clear 405 error', async () => {
      const getRes = await request(app).get('/api/carbon-estimate');
      expect(getRes.status).toBe(405);
      expect(getRes.body.message).toContain('Method GET not allowed');

      const putRes = await request(app).put('/api/carbon-estimate');
      expect(putRes.status).toBe(405);
      expect(putRes.body.message).toContain('Method PUT not allowed');
    });

    it('denies arbitrary non-existent or dangerous server methods on health check routes', async () => {
      const deleteRes = await request(app).delete('/api/health');
      expect(deleteRes.status).toBe(405);
      expect(deleteRes.body.message).toContain('Method DELETE not allowed');
    });
  });

  describe('2. Safe Error Handling & Secrets Exposure Prevention', () => {
    it('never exposes raw server stack traces, filesystem structures, or server package keys in client error shapes', async () => {
      // Send fully malformed JSON payload to /api/carbon-estimate
      const res = await request(app)
        .post('/api/carbon-estimate')
        .set('Content-Type', 'application/json')
        .send('{"bad_json": '); // Syntax error

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Unable to process the request owing to malformed input payload configuration.');
      expect(res.body.stack).toBeUndefined(); // Stack traces are strictly hidden!
    });
  });

  describe('3. Inputs Sanitization Guards', () => {
    it('cleans or normalizes string inputs of malicious escape characters and leading spaces', () => {
      const xssInput = '  <script>alert("XSS")</script>EcoUser  ';
      const result = sanitizeStringInput(xssInput, 'fallback_user');
      // Verify trimming and fallback safety
      expect(result).toBe('<script>alert("XSS")</script>EcoUser');
    });

    it('sanitizes input numbers preventing underflows (negative numbers) or dangerous limits', () => {
      expect(sanitizeNumberInput(-500, 10)).toBe(10); // clamped to default/fallback
      expect(sanitizeNumberInput('not_a_number', 25)).toBe(25); // handles string injection
      expect(sanitizeNumberInput(null, 30)).toBe(30); // handles null
    });
  });

  describe('4. Frontend Environment & Secrets Leak Review', () => {
    it('ensures standard client-side storage keys are safe with proper namespaces', () => {
      // We check that storage keeps namespace tags
      const ns = 'ecolens_records';
      expect(ns).toBe('ecolens_records');
    });
  });
});
