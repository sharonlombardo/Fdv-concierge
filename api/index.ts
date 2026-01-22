import type { VercelRequest, VercelResponse } from '@vercel/node';
import { EMBEDDED_IMAGE_MAPPINGS } from '../shared/embedded-image-mappings';

// Simplified API for Vercel serverless
// This handles the core image-related endpoints without the full Express app

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req;
  const path = url?.split('?')[0] || '';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/images - Return embedded image mappings
    if (path === '/api/images' || path === '/api') {
      const images = Object.entries(EMBEDDED_IMAGE_MAPPINGS).map(([key, url]) => ({
        id: 0,
        imageKey: key,
        customUrl: url,
        originalUrl: null,
        label: null,
        updatedAt: Date.now(),
      }));
      return res.status(200).json(images);
    }

    // GET /api/image-slots - Return image slots with mappings
    if (path === '/api/image-slots') {
      const customImageMap = new Map(Object.entries(EMBEDDED_IMAGE_MAPPINGS));
      return res.status(200).json({
        slots: [],
        grouped: {},
        mappings: Object.fromEntries(customImageMap)
      });
    }

    // GET /api/journal - Return empty journal entries
    if (path === '/api/journal') {
      return res.status(200).json({});
    }

    // GET /api/saves - Return empty saves
    if (path === '/api/saves') {
      return res.status(200).json([]);
    }

    // GET /api/library - Return empty library
    if (path === '/api/library') {
      return res.status(200).json([]);
    }

    // GET /api/rules - Return empty rules
    if (path === '/api/rules') {
      return res.status(200).json([]);
    }

    // GET /api/selfies - Return empty selfies
    if (path === '/api/selfies') {
      return res.status(200).json([]);
    }

    // Handle POST requests (stub implementations)
    if (method === 'POST') {
      return res.status(200).json({ success: true, message: 'Data saved (stub)' });
    }

    // 404 for unknown routes
    return res.status(404).json({ error: 'Not found', path });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
