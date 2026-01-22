import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();

app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Create a minimal HTTP server for route registration
const httpServer = createServer(app);

// Initialize routes once
let routesInitialized = false;
const initRoutes = async () => {
  if (!routesInitialized) {
    try {
      await registerRoutes(httpServer, app);
      routesInitialized = true;
      console.log('Routes initialized successfully');
    } catch (error) {
      console.error('Failed to initialize routes:', error);
      throw error;
    }
  }
};

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel serverless
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initRoutes();
    // @ts-ignore - Express app is compatible with Vercel handler
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
