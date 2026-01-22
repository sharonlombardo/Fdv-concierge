import type { Express } from "express";

/**
 * Register object storage routes.
 *
 * Note: Images are now served directly from Vercel Blob storage.
 * The /objects/ routes are kept for backwards compatibility but
 * should not be used for new image references.
 */
export function registerObjectStorageRoutes(app: Express): void {
  // Legacy /objects/ route - returns 410 Gone since images moved to Vercel Blob
  app.get("/objects/:objectPath(*)", async (_req, res) => {
    return res.status(410).json({
      error: "Images have been migrated to Vercel Blob storage",
      message: "This endpoint is deprecated. Images are now served directly from Vercel Blob CDN."
    });
  });

  // Upload endpoint - use Vercel Blob for new uploads
  app.post("/api/uploads/request-url", async (_req, res) => {
    return res.status(503).json({
      error: "Use Vercel Blob for uploads",
      message: "Object storage uploads should use Vercel Blob SDK directly."
    });
  });
}
