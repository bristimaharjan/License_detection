import { spawn } from "node:child_process";
import path from "node:path";

import { env } from "../utils/env.js";

export type Detection = {
  class_name: string;
  confidence: number;
  bbox_xyxy: [number, number, number, number];
  bbox_normalized: [number, number, number, number];
};

export type InferenceResult = {
  prediction: string;
  detections: Detection[];
  image_size: {
    width: number;
    height: number;
  };
  iou_score: number | null;
  is_correct: boolean | null;
};

export function runInference(imagePath: string, originalFilename?: string): Promise<InferenceResult> {
  return new Promise((resolve, reject) => {
    const modelPath = path.resolve(process.cwd(), env.modelPath);
    const annotationsDir = path.resolve(process.cwd(), "..", "data", "annotations");
    const resolvedImagePath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(process.cwd(), imagePath);

    const pythonScript = [
      "import argparse, json",
      "from ultralytics import YOLO",
      "from PIL import Image",
      "import xml.etree.ElementTree as ET",
      "from pathlib import Path",
      "",
      "def clamp(v, lo=0.0, hi=1.0):",
      "    return max(lo, min(hi, v))",
      "",
      "def iou_xyxy(a, b):",
      "    ax1, ay1, ax2, ay2 = a",
      "    bx1, by1, bx2, by2 = b",
      "    ix1 = max(ax1, bx1)",
      "    iy1 = max(ay1, by1)",
      "    ix2 = min(ax2, bx2)",
      "    iy2 = min(ay2, by2)",
      "    iw = max(0.0, ix2 - ix1)",
      "    ih = max(0.0, iy2 - iy1)",
      "    inter = iw * ih",
      "    area_a = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)",
      "    area_b = max(0.0, bx2 - bx1) * max(0.0, by2 - by1)",
      "    union = area_a + area_b - inter",
      "    return 0.0 if union <= 0 else inter / union",
      "",
      "def load_gt_boxes(annotations_dir, original_name):",
      "    if not original_name:",
      "        return []",
      "    stem = Path(original_name).stem",
      "    xml_path = Path(annotations_dir) / f'{stem}.xml'",
      "    if not xml_path.exists():",
      "        return []",
      "    tree = ET.parse(xml_path)",
      "    root = tree.getroot()",
      "    boxes = []",
      "    for obj in root.findall('object'):",
      "        b = obj.find('bndbox')",
      "        if b is None:",
      "            continue",
      "        x1 = float(b.findtext('xmin', '0'))",
      "        y1 = float(b.findtext('ymin', '0'))",
      "        x2 = float(b.findtext('xmax', '0'))",
      "        y2 = float(b.findtext('ymax', '0'))",
      "        if x2 > x1 and y2 > y1:",
      "            boxes.append([x1, y1, x2, y2])",
      "    return boxes",
      "",
      "parser = argparse.ArgumentParser()",
      "parser.add_argument('--image', required=True)",
      "parser.add_argument('--model-path', required=True)",
      "parser.add_argument('--annotations-dir', required=True)",
      "parser.add_argument('--original-name', default='')",
      "args = parser.parse_args()",
      "",
      "model = YOLO(args.model_path)",
      "pred = model.predict(source=args.image, conf=0.25, verbose=False)[0]",
      "w, h = Image.open(args.image).convert('RGB').size",
      "",
      "detections = []",
      "if pred.boxes is not None:",
      "    xyxy = pred.boxes.xyxy.cpu().tolist()",
      "    conf = pred.boxes.conf.cpu().tolist() if pred.boxes.conf is not None else [0.0] * len(xyxy)",
      "    cls = pred.boxes.cls.cpu().tolist() if pred.boxes.cls is not None else [0.0] * len(xyxy)",
      "    for box, score, c in zip(xyxy, conf, cls):",
      "        x1, y1, x2, y2 = [float(v) for v in box]",
      "        name = pred.names.get(int(c), str(int(c))) if isinstance(pred.names, dict) else str(int(c))",
      "        detections.append({",
      "            'class_name': name,",
      "            'confidence': float(score),",
      "            'bbox_xyxy': [x1, y1, x2, y2],",
      "            'bbox_normalized': [clamp(x1 / w), clamp(y1 / h), clamp(x2 / w), clamp(y2 / h)]",
      "        })",
      "",
      "gt_boxes = load_gt_boxes(args.annotations_dir, args.original_name)",
      "best_iou = None",
      "if detections and gt_boxes:",
      "    max_iou = 0.0",
      "    for d in detections:",
      "        for g in gt_boxes:",
      "            max_iou = max(max_iou, iou_xyxy(d['bbox_xyxy'], g))",
      "    best_iou = float(max_iou)",
      "",
      "payload = {",
      "    'prediction': detections[0]['class_name'] if detections else 'none',",
      "    'detections': detections,",
      "    'image_size': {'width': int(w), 'height': int(h)},",
      "    'iou_score': best_iou,",
      "    'is_correct': (best_iou >= 0.5) if best_iou is not None else None",
      "}",
      "print(json.dumps(payload))",
    ].join("\n");

    const args = [
      "-c",
      pythonScript,
      "--image",
      resolvedImagePath,
      "--model-path",
      modelPath,
      "--annotations-dir",
      annotationsDir,
      "--original-name",
      originalFilename ?? "",
    ];

    const child = spawn(env.pythonExecutable, args, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(new Error(`Failed to start inference process: ${error.message}`));
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Inference failed with code ${code}: ${stderr || stdout}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout.trim()) as InferenceResult;
        resolve(parsed);
      } catch (error) {
        reject(new Error(`Invalid inference output: ${stdout}. ${String(error)}`));
      }
    });
  });
}
