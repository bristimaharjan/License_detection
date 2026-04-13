import fs from "node:fs/promises";
import path from "node:path";

import { Router } from "express";
import multer from "multer";

import { listSampleImages, readModelArtifacts } from "../services/artifactsService.js";
import { runInference } from "../services/inferenceService.js";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const inferenceRoutes = Router();

inferenceRoutes.get("/metrics", async (_req, res) => {
  const artifacts = await readModelArtifacts();
  res.json(artifacts);
});

inferenceRoutes.get("/samples", async (_req, res) => {
  try {
    const samples = await listSampleImages();
    res.json({ samples });
  } catch (error) {
    res.status(500).json({
      error: "Failed to list sample images",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

inferenceRoutes.post("/predict", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Image file is required in multipart field 'image'." });
    return;
  }

  try {
    const ext = path.extname(req.file.originalname) || ".png";
    const renamedPath = `${req.file.path}${ext}`;
    await fs.rename(req.file.path, renamedPath);

    const result = await runInference(renamedPath, req.file.originalname);
    res.json({
      filename: req.file.originalname,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      error: "Inference failed",
      details: error instanceof Error ? error.message : String(error),
    });
  } finally {
    await fs.unlink(req.file.path).catch(() => undefined);
    const ext = path.extname(req.file.originalname) || ".png";
    await fs.unlink(`${req.file.path}${ext}`).catch(() => undefined);
  }
});
