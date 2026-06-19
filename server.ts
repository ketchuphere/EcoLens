import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { validateEnvironment } from './src/utils/envValidate';
import { Logger } from './src/utils/logger';

// Load environment variables safely
dotenv.config();

// Validate critical variables immediately upon process bootstrap
validateEnvironment();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests safely with a size limit
app.use(express.json({ limit: '10kb' }));

// Safe JSON Syntax error handler to override defaults and prevent stacks leakage
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(400).json({
      status: 'error',
      message: 'Unable to process the request owing to malformed input payload configuration.',
      timestamp: new Date().toISOString()
    });
    return;
  }
  next();
});

// Set secure response headers to harden the deployment
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'");
  next();
});

// Helper for sending standardised secure error responses
const sendError = (res: Response, status: number, message: string) => {
  res.status(status).json({
    status: 'error',
    message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Endpoint: /api/health
 * Method: GET Only
 * Description: Simple service health status check.
 * Excludes sensitive system data such as environment variable names, base paths, database logs, or server systems.
 */
app.all('/api/health', (req: Request, res: Response, _next: NextFunction) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendError(res, 405, `Method ${req.method} not allowed. Please use GET.`);
  }

  try {
    res.status(200).json({
      status: 'success',
      data: {
        service: 'EcoLens',
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
      }
    });
  } catch {
    sendError(res, 500, 'An internal error occurred while processing health diagnostics check.');
  }
});

/**
 * Endpoint: /api/carbon-estimate
 * Method: POST Only
 * Description: Safely calculates estimated carbon output based on basic travel and electric utilities.
 * Includes method validation and strict payload input validation.
 */
app.all('/api/carbon-estimate', (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 405, `Method ${req.method} not allowed. Please use POST.`);
  }

  try {
    const { distanceCar, electricityKwh } = req.body;

    // Check for negative numbers or non-finite values
    if (distanceCar !== undefined) {
      if (typeof distanceCar !== 'number' || isNaN(distanceCar) || !isFinite(distanceCar) || distanceCar < 0) {
        return sendError(res, 400, 'Validation failed: distanceCar must be a non-negative finite number.');
      }
    }

    if (electricityKwh !== undefined) {
      if (typeof electricityKwh !== 'number' || isNaN(electricityKwh) || !isFinite(electricityKwh) || electricityKwh < 0) {
        return sendError(res, 400, 'Validation failed: electricityKwh must be a non-negative finite number.');
      }
    }

    // Standard local conversion variables
    const carFactor = 0.18; // 0.18 kg CO2 per km
    const electricityFactor = 0.40; // 0.40 kg CO2 per kWh

    const carEmissions = (distanceCar || 0) * carFactor;
    const electricityEmissions = (electricityKwh || 0) * electricityFactor;
    const totalEmissions = carEmissions + electricityEmissions;

    res.status(200).json({
      status: 'success',
      calculation: {
        carEmissions: parseFloat(carEmissions.toFixed(2)),
        electricityEmissions: parseFloat(electricityEmissions.toFixed(2)),
        totalEmissions: parseFloat(totalEmissions.toFixed(2)),
        units: 'kg CO2'
      },
      timestamp: new Date().toISOString()
    });
  } catch {
    sendError(res, 400, 'Unable to process the request owing to malformed input payload configuration.');
  }
});

// Configure Vite middleware or Static files asset pipeline
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
    app.listen(PORT, '0.0.0.0', () => {
      Logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  }
};

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer().catch((err) => {
    Logger.error('Fatal: Failed to bootstrap full-stack server container', err);
  });
}

export default app;
