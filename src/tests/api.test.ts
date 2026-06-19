import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server';

describe('Express API Endpoints', () => {
  describe('GET /api/health', () => {
    it('returns healthy status code and JSON metadata', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.service).toBe('EcoLens');
      expect(response.body.data).toHaveProperty('uptime');
    });

    it('rejects unsupported methods like POST with a 405 status code', async () => {
      const response = await request(app)
        .post('/api/health')
        .expect('Content-Type', /json/)
        .expect(405);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('not allowed');
    });
  });

  describe('POST /api/carbon-estimate', () => {
    it('successfully evaluates estimate calculations for valid metrics', async () => {
      const payload = {
        distanceCar: 100,
        electricityKwh: 200
      };

      const response = await request(app)
        .post('/api/carbon-estimate')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.calculation.carEmissions).toBe(18.0); // 100 * 0.18
      expect(response.body.calculation.electricityEmissions).toBe(80.0); // 200 * 0.40
      expect(response.body.calculation.totalEmissions).toBe(98.0);
    });

    it('rejects negative distance numeric payloads with a 400 bad request', async () => {
      const payload = {
        distanceCar: -50,
        electricityKwh: 100
      };

      const response = await request(app)
        .post('/api/carbon-estimate')
        .send(payload)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Validation failed');
    });

    it('rejects HTTP GET on the carbon estimate endpoint with 405', async () => {
      const response = await request(app)
        .get('/api/carbon-estimate')
        .expect(405);

      expect(response.body.status).toBe('error');
    });
  });
});
