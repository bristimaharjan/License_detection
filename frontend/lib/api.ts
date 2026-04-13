export type PredictionResponse = {
  filename: string;
  prediction: string;
  detections: Array<{
    class_name: string;
    confidence: number;
    bbox_xyxy: [number, number, number, number];
    bbox_normalized: [number, number, number, number];
  }>;
  image_size: {
    width: number;
    height: number;
  };
  iou_score: number | null;
  is_correct: boolean | null;
};

export type YoloSummary = {
  model_name?: string;
  run_name?: string;
  img_size?: number;
  batch_size?: number;
  epochs?: number;
  metrics?: Record<string, number>;
  splits?: Record<string, number>;
  classes?: string[];
  dataset_yaml?: string;
  run_dir?: string;
};

export type MetricsResponse = {
  yolo_summary: YoloSummary | null;
  training_history: Record<string, unknown> | null;
};

export type SampleImage = {
  name: string;
  url: string;
  expectedLabel: string | null;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function predictImage(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${baseUrl}/api/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<PredictionResponse>;
}

export async function fetchModelMetrics(): Promise<MetricsResponse> {
  const response = await fetch(`${baseUrl}/api/metrics`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<MetricsResponse>;
}

export async function fetchSampleImages(): Promise<SampleImage[]> {
  const response = await fetch(`${baseUrl}/api/samples`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { samples: SampleImage[] };
  return payload.samples;
}

export function toApiUrl(relativeOrAbsolute: string): string {
  if (relativeOrAbsolute.startsWith("http://") || relativeOrAbsolute.startsWith("https://")) {
    return relativeOrAbsolute;
  }
  return `${baseUrl}${relativeOrAbsolute}`;
}
