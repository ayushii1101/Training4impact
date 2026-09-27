import express from 'express';
import cors from 'cors';

import paymentRoutes from './routes/paymentRoutes.js';

function resolveAllowedOrigins() {
  const raw = process.env.CORS_ORIGIN || '';
  const configured = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured.length > 0) {
    return configured;
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'CORS_ORIGIN is not configured. Cross-origin browser requests from the production frontend will be blocked. Set CORS_ORIGIN to your production frontend origin(s).'
    );
    return [];
  }

  return ['http://localhost:5173'];
}

export function createApp() {
  const app = express();

  const allowedOrigins = resolveAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        // Server-to-server requests (webhooks, health checks, curl) send no Origin header.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Disallow unknown origins (no Access-Control-Allow-Origin response header).
        return callback(null, false);
      },
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    })
  );

  // Thin middleware stack that sets typical hardening headers. The platform TLS
  // termination (reverse proxy) handles HTTPS; these protect the HTTP layer.
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  // Razorpay requires the raw request body for webhook signature verification.
  app.use('/api/payments/webhook', express.raw({ type: '*/*' }));
  app.use(express.json());

  app.use('/api/payments', paymentRoutes);

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Training4Impact backend is running',
    });
  });

  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        success: false,
        message: 'Malformed JSON in request body',
      });
    }
    return next(err);
  });

  return app;
}