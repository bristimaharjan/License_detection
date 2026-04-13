import fs from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".bmp", ".webp"]);

const artifactsDir = path.resolve(process.cwd(), "..", "ml", "artifacts");
const yoloRunsDir = path.resolve(artifactsDir, "yolo_runs", "plate_yolov8s");
const yoloDatasetDir = path.resolve(artifactsDir, "yolo_plate_dataset");
const imagesDir = path.resolve(process.cwd(), "..", "data", "images");

async function readOptionalJsonFile<T>(filename: string): Promise<T | null> {
  try {
    const filePath = path.join(artifactsDir, filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

async function parseLatestYoloMetricsFromCsv() {
  try {
    const csvPath = path.join(yoloRunsDir, "results.csv");
    const text = await fs.readFile(csvPath, "utf-8");
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      return null;
    }

    const header = lines[0].split(",").map((s) => s.trim());
    const last = lines[lines.length - 1].split(",").map((s) => s.trim());
    const row: Record<string, number> = {};

    for (let i = 0; i < header.length; i += 1) {
      const key = header[i];
      const value = Number(last[i]);
      if (Number.isFinite(value)) {
        row[key] = value;
      }
    }

    const [trainCount, valCount, testCount] = await Promise.all([
      fs.readdir(path.join(yoloDatasetDir, "images", "train"), { withFileTypes: true }),
      fs.readdir(path.join(yoloDatasetDir, "images", "val"), { withFileTypes: true }),
      fs.readdir(path.join(yoloDatasetDir, "images", "test"), { withFileTypes: true }),
    ]);

    return {
      model_name: "yolov8s.pt",
      run_name: "plate_yolov8s",
      metrics: {
        test_precision: row["metrics/precision(B)"] ?? NaN,
        test_recall: row["metrics/recall(B)"] ?? NaN,
        test_map50: row["metrics/mAP50(B)"] ?? NaN,
        test_map50_95: row["metrics/mAP50-95(B)"] ?? NaN,
        overall_accuracy: row["metrics/mAP50(B)"] ?? NaN,
      },
      splits: {
        train: trainCount.filter((d) => d.isFile()).length,
        val: valCount.filter((d) => d.isFile()).length,
        test: testCount.filter((d) => d.isFile()).length,
      },
      run_dir: yoloRunsDir,
    };
  } catch {
    return null;
  }
}

function withDerivedOverallAccuracy(summary: Record<string, unknown> | null) {
  if (!summary) {
    return null;
  }

  const metrics = (summary.metrics as Record<string, unknown> | undefined) ?? {};
  const map50 = metrics.test_map50;

  if (metrics.overall_accuracy === undefined && typeof map50 === "number" && Number.isFinite(map50)) {
    return {
      ...summary,
      metrics: {
        ...metrics,
        overall_accuracy: map50,
      },
    };
  }

  return summary;
}

export async function readModelArtifacts() {
  const [yoloSummary, trainingHistory] = await Promise.all([
    readOptionalJsonFile<Record<string, unknown>>("plate_bbox_yolo_metrics.json"),
    readOptionalJsonFile<Record<string, unknown>>("plate_bbox_training_history.json"),
  ]);

  const fallbackYoloSummary = yoloSummary ? null : await parseLatestYoloMetricsFromCsv();
  const mergedSummary = withDerivedOverallAccuracy(
    (yoloSummary as Record<string, unknown> | null) ?? (fallbackYoloSummary as Record<string, unknown> | null),
  );

  return {
    yolo_summary: mergedSummary,
    training_history: trainingHistory,
  };
}

export async function listSampleImages() {
  const files = await fs.readdir(imagesDir, { withFileTypes: true });
  return files
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => ({
      name: entry.name,
      url: `/images/${encodeURIComponent(entry.name)}`,
      expectedLabel: null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 36);
}

export function getSampleImagesDir() {
  return imagesDir;
}

export function getCharacterDatasetDir() {
  return imagesDir;
}
