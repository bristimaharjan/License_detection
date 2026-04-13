import cors from "cors";
import express from "express";

import { inferenceRoutes } from "./routes/inferenceRoutes.js";
import { getSampleImagesDir } from "./services/artifactsService.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/images", express.static(getSampleImagesDir()));
app.use("/api", inferenceRoutes);
