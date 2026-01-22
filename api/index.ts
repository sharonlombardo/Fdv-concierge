import type { VercelRequest, VercelResponse } from '@vercel/node';
import mappings from '../shared/vercel-blob-mappings.json';

const EMBEDDED_IMAGE_MAPPINGS: Record<string, string> = mappings;

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
      const images = Object.entries(EMBEDDED_IMAGE_MAPPINGS).map(([key, imageUrl]) => ({
        id: 0,
        imageKey: key,
        customUrl: imageUrl,
        originalUrl: null,
        label: null,
        updatedAt: Date.now(),
      }));
      return res.status(200).json(images);
    }

    // GET /api/image-slots
    if (path === '/api/image-slots') {
      return res.status(200).json({
        slots: [],
        grouped: {},
        mappings: EMBEDDED_IMAGE_MAPPINGS
      });
    }

    // GET /api/journal
    if (path === '/api/journal') {
      return res.status(200).json({});
    }

    // GET /api/saves
    if (path === '/api/saves') {
      return res.status(200).json([]);
    }

    // GET /api/library
    if (path === '/api/library') {
      return res.status(200).json([]);
    }

    // GET /api/rules
    if (path === '/api/rules') {
      return res.status(200).json([]);
    }

    // GET /api/selfies
    if (path === '/api/selfies') {
      return res.status(200).json([]);
    }

    // POST handlers (stub)
    if (method === 'POST') {
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: 'Not found', path });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
