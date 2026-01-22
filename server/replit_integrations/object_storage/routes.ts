import type { Express } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

// Check if we're running in Replit environment (has the sidecar)
const isReplitEnvironment = !!process.env.REPL_ID || !!process.env.REPLIT_DEPLOYMENT;

// Replit deployment URL for proxying images in local development
const REPLIT_PROXY_URL = process.env.REPLIT_PROXY_URL || "https://elite-canvas--sharonplombardo.replit.app";

/**
 * Register object storage routes for file uploads.
 *
 * This provides example routes for the presigned URL upload flow:
 * 1. POST /api/uploads/request-url - Get a presigned URL for uploading
 * 2. The client then uploads directly to the presigned URL
 *
 * IMPORTANT: These are example routes. Customize based on your use case:
 * - Add authentication middleware for protected uploads
 * - Add file metadata storage (save to database after upload)
 * - Add ACL policies for access control
 */
export function registerObjectStorageRoutes(app: Express): void {
  // Only create object storage service in Replit environment
  const objectStorageService = isReplitEnvironment ? new ObjectStorageService() : null;

  /**
   * Request a presigned URL for file upload.
   *
   * Request body (JSON):
   * {
   *   "name": "filename.jpg",
   *   "size": 12345,
   *   "contentType": "image/jpeg"
   * }
   *
   * Response:
   * {
   *   "uploadURL": "https://storage.googleapis.com/...",
   *   "objectPath": "/objects/uploads/uuid"
   * }
   *
   * IMPORTANT: The client should NOT send the file to this endpoint.
   * Send JSON metadata only, then upload the file directly to uploadURL.
   */
  app.post("/api/uploads/request-url", async (req, res) => {
    if (!objectStorageService) {
      return res.status(503).json({
        error: "Object storage not available in local development",
      });
    }

    try {
      const { name, size, contentType } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      const uploadURL = await objectStorageService.getObjectEntityUploadURL();

      // Extract object path from the presigned URL for later reference
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

      res.json({
        uploadURL,
        objectPath,
        // Echo back the metadata for client convenience
        metadata: { name, size, contentType },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  /**
   * Serve uploaded objects.
   *
   * GET /objects/:objectPath(*)
   *
   * This serves files from object storage. For public files, no auth needed.
   * For protected files, add authentication middleware and ACL checks.
   *
   * In local development, proxies requests to the Replit deployment.
   */
  app.get("/objects/:objectPath(*)", async (req, res) => {
    if (!objectStorageService) {
      // Local development: proxy to Replit deployment
      const proxyUrl = `${REPLIT_PROXY_URL}${req.path}`;

      try {
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          return res.status(response.status).json({ error: "Image not found on Replit" });
        }

        // Forward content type header
        const contentType = response.headers.get("content-type");
        if (contentType) {
          res.set("Content-Type", contentType);
        }

        // Forward cache control
        const cacheControl = response.headers.get("cache-control");
        if (cacheControl) {
          res.set("Cache-Control", cacheControl);
        }

        // Stream the response body to the client
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      } catch (error) {
        console.error("Error proxying image from Replit:", error);
        return res.status(502).json({ error: "Failed to proxy image from Replit" });
      }
      return;
    }

    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });
}
