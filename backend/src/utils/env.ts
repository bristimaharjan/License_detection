import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  pythonExecutable: process.env.PYTHON_EXECUTABLE ?? "python",
  modelPath: process.env.MODEL_PATH ?? "../ml/artifacts/plate_bbox_yolo_best.pt",
};
