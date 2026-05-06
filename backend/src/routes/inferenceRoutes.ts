import fs from "node:fs/promises";
import path from "node:path";

import { Router } from "express";
import multer from "multer";

import { listSampleImages, readModelArtifacts } from "../services/artifactsService.js";
import { runInference } from "../services/inferenceService.js";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
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

    // Build the enriched response merging detection + vehicle data
    const topDetection = result.detections[0] ?? null;
    const vehicle = result.vehicle ?? null;

    res.json({
      filename: req.file.originalname,

      // Detection fields
      plate_text: result.plate_text || "",
      prediction: result.prediction,
      confidence: topDetection ? topDetection.confidence : 0,
      detections: result.detections,
      image_size: result.image_size,
      iou_score: result.iou_score,
      is_correct: result.is_correct,

      // Vehicle database fields (null when plate not found in DB)
      vehicle: vehicle
        ? {
            plate_number: vehicle.plate_number,
            owner_name: vehicle.owner_name,
            address: vehicle.address,
            vehicle_year: vehicle.vehicle_year,
            vehicle_make: vehicle.vehicle_make,
            vehicle_model: vehicle.vehicle_model,
            vehicle_color: vehicle.vehicle_color,
            reg_expiry: vehicle.reg_expiry,
            reg_status: vehicle.reg_status,
            insurance: vehicle.insurance,
            insurance_provider: vehicle.insurance_provider,
            policy_number: vehicle.policy_number,
            fines: vehicle.fines,
            fine_amount: vehicle.fine_amount,
            is_flagged: vehicle.is_flagged,
          }
        : null,
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
